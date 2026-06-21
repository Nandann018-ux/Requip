import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersRepository } from '../repositories/users.repository';
import {
  EmailAlreadyExistsException,
  AadhaarAlreadyExistsException,
  PanAlreadyExistsException,
  UserNotFoundException,
  UserAlreadyDeletedException,
} from '../../../common/exceptions/user.exceptions';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const mockUser = {
  id: 'uuid-1',
  firstName: 'Nandan',
  lastName: 'Acharya',
  email: 'nandan@example.com',
  primaryMobile: '9876543210',
  secondaryMobile: null,
  aadhaarNumber: '123412341234',
  panNumber: 'ABCDE1234F',
  dateOfBirth: new Date('2000-01-15'),
  placeOfBirth: 'Bangalore',
  currentAddress: '123 MG Road',
  permanentAddress: '456 Brigade Road',
  isActive: true,
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUsersRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByIdIncludeDeleted: jest.fn(),
  findByEmail: jest.fn(),
  findByAadhaar: jest.fn(),
  findByPan: jest.fn(),
  findAllPaginated: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  createAuditLog: jest.fn(),
  findAuditLogs: jest.fn(),
  searchUsers: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateUserDto = {
      firstName: 'Nandan',
      lastName: 'Acharya',
      email: 'nandan@example.com',
      primaryMobile: '9876543210',
      aadhaarNumber: '123412341234',
      panNumber: 'ABCDE1234F',
      dateOfBirth: '2000-01-15',
      placeOfBirth: 'Bangalore',
      currentAddress: '123 MG Road',
      permanentAddress: '456 Brigade Road',
    };

    it('should create user successfully', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByAadhaar.mockResolvedValue(null);
      mockUsersRepository.findByPan.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockUser);
      mockUsersRepository.createAuditLog.mockResolvedValue({});

      const result = await service.create(createDto);

      expect(result).toEqual({ id: mockUser.id });
      expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.createAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE' }),
      );
    });

    it('should throw EmailAlreadyExistsException on duplicate email', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
      mockUsersRepository.findByAadhaar.mockResolvedValue(null);
      mockUsersRepository.findByPan.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(EmailAlreadyExistsException);
    });

    it('should throw AadhaarAlreadyExistsException on duplicate Aadhaar', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByAadhaar.mockResolvedValue(mockUser);
      mockUsersRepository.findByPan.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(AadhaarAlreadyExistsException);
    });

    it('should throw PanAlreadyExistsException on duplicate PAN', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByAadhaar.mockResolvedValue(null);
      mockUsersRepository.findByPan.mockResolvedValue(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(PanAlreadyExistsException);
    });

    it('should reject future date of birth', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByAadhaar.mockResolvedValue(null);
      mockUsersRepository.findByPan.mockResolvedValue(null);

      const futureDto = { ...createDto, dateOfBirth: '2099-01-01' };
      await expect(service.create(futureDto)).rejects.toThrow(BadRequestException);
    });

    it('should run uniqueness checks in parallel', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.findByAadhaar.mockResolvedValue(null);
      mockUsersRepository.findByPan.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockUser);
      mockUsersRepository.createAuditLog.mockResolvedValue({});

      await service.create(createDto);

      // All three checks must be called exactly once
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findByAadhaar).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.findByPan).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      mockUsersRepository.findAllPaginated.mockResolvedValue([[mockUser], 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.totalRecords).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPreviousPage).toBe(false);
    });

    it('should calculate pagination correctly for multiple pages', async () => {
      const users = Array(5).fill(mockUser);
      mockUsersRepository.findAllPaginated.mockResolvedValue([users, 25]);

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.pagination.totalPages).toBe(5);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });

    it('should sanitize invalid sort fields to createdAt', async () => {
      mockUsersRepository.findAllPaginated.mockResolvedValue([[], 0]);

      await service.findAll({ page: 1, limit: 10, sortBy: 'INVALID_FIELD' });

      expect(mockUsersRepository.findAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      mockUsersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw UserNotFoundException for missing user', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateUserDto = { firstName: 'UpdatedName' };

    it('should update user successfully and create audit log', async () => {
      mockUsersRepository.findById.mockResolvedValue(mockUser);
      mockUsersRepository.update.mockResolvedValue({ ...mockUser, firstName: 'UpdatedName' });
      mockUsersRepository.createAuditLog.mockResolvedValue({});

      await expect(service.update('uuid-1', updateDto)).resolves.toBeUndefined();
      expect(mockUsersRepository.createAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'UPDATE' }),
      );
    });

    it('should throw UserNotFoundException for missing user', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(UserNotFoundException);
    });

    it('should reject future date of birth on update', async () => {
      mockUsersRepository.findById.mockResolvedValue(mockUser);

      await expect(
        service.update('uuid-1', { dateOfBirth: '2099-01-01' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should soft delete user and create audit log', async () => {
      mockUsersRepository.findByIdIncludeDeleted.mockResolvedValue(mockUser);
      mockUsersRepository.softDelete.mockResolvedValue({ ...mockUser, isDeleted: true });
      mockUsersRepository.createAuditLog.mockResolvedValue({});

      await expect(service.remove('uuid-1')).resolves.toBeUndefined();
      expect(mockUsersRepository.softDelete).toHaveBeenCalledWith('uuid-1');
      expect(mockUsersRepository.createAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DELETE' }),
      );
    });

    it('should throw UserNotFoundException for missing user', async () => {
      mockUsersRepository.findByIdIncludeDeleted.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(UserNotFoundException);
    });

    it('should throw UserAlreadyDeletedException for already deleted user', async () => {
      mockUsersRepository.findByIdIncludeDeleted.mockResolvedValue({ ...mockUser, isDeleted: true });

      await expect(service.remove('uuid-1')).rejects.toThrow(UserAlreadyDeletedException);
    });
  });

  describe('search', () => {
    it('should return search results with pagination', async () => {
      mockUsersRepository.searchUsers.mockResolvedValue([[mockUser], 1]);

      const result = await service.search({ q: 'Nandan', page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.totalRecords).toBe(1);
    });

    it('should return empty results for no match', async () => {
      mockUsersRepository.searchUsers.mockResolvedValue([[], 0]);

      const result = await service.search({ q: 'nonexistent', page: 1, limit: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.totalRecords).toBe(0);
    });
  });

  describe('getAuditLogs', () => {
    it('should return audit logs for existing user', async () => {
      const logs = [{ id: 'log-1', userId: 'uuid-1', action: 'CREATE' }];
      mockUsersRepository.findByIdIncludeDeleted.mockResolvedValue(mockUser);
      mockUsersRepository.findAuditLogs.mockResolvedValue(logs);

      const result = await service.getAuditLogs('uuid-1');
      expect(result).toEqual(logs);
    });

    it('should throw UserNotFoundException for missing user', async () => {
      mockUsersRepository.findByIdIncludeDeleted.mockResolvedValue(null);

      await expect(service.getAuditLogs('non-existent')).rejects.toThrow(UserNotFoundException);
    });
  });
});
