import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  search: jest.fn(),
  getAuditLogs: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  describe('POST /users (create)', () => {
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

    it('should create user and return success envelope', async () => {
      mockUsersService.create.mockResolvedValue({ id: 'uuid-1' });

      const result = await controller.create(createDto);

      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
        data: { id: 'uuid-1' },
      });
    });

    it('should propagate ConflictException on duplicate email', async () => {
      mockUsersService.create.mockRejectedValue(new ConflictException('Duplicate email'));

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('GET /users (findAll)', () => {
    it('should return paginated users', async () => {
      const paginatedResult = {
        success: true,
        data: [],
        pagination: {
          page: 1, limit: 10, totalRecords: 0,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      };
      mockUsersService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('GET /users/:id (findOne)', () => {
    it('should return user wrapped in success envelope', async () => {
      const user = { id: 'uuid-1', firstName: 'Nandan' };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('uuid-1');
      expect(result).toEqual({ success: true, data: user });
    });

    it('should propagate NotFoundException for missing user', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('PUT /users/:id (update)', () => {
    it('should update user and return success envelope', async () => {
      mockUsersService.update.mockResolvedValue(undefined);

      const result = await controller.update('uuid-1', { firstName: 'Updated' } as UpdateUserDto);
      expect(result).toEqual({ success: true, message: 'User updated successfully' });
    });

    it('should propagate NotFoundException for missing user', async () => {
      mockUsersService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('non-existent', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /users/:id (remove)', () => {
    it('should soft-delete user and return success envelope', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('uuid-1');
      expect(result).toEqual({ success: true, message: 'User deleted successfully' });
    });

    it('should propagate NotFoundException for missing user', async () => {
      mockUsersService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /users/search (search)', () => {
    it('should return search results', async () => {
      const searchResult = { success: true, data: [], pagination: { page: 1, limit: 10, totalRecords: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
      mockUsersService.search.mockResolvedValue(searchResult);

      const result = await controller.search({ q: 'Nandan', page: 1, limit: 10 });
      expect(result).toEqual(searchResult);
    });
  });

  describe('GET /users/:id/audit-logs (getAuditLogs)', () => {
    it('should return audit logs wrapped in success envelope', async () => {
      const logs = [{ id: 'log-1', action: 'CREATE' }];
      mockUsersService.getAuditLogs.mockResolvedValue(logs);

      const result = await controller.getAuditLogs('uuid-1');
      expect(result).toEqual({ success: true, data: logs });
    });
  });
});
