import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AUDIT_ACTIONS } from '../../../common/constants/audit-actions';
import {
  UserNotFoundException,
  EmailAlreadyExistsException,
  AadhaarAlreadyExistsException,
  PanAlreadyExistsException,
  UserAlreadyDeletedException,
} from '../../../common/exceptions/user.exceptions';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto, performedBy?: string): Promise<{ id: string }> {
    this.validateDateOfBirth(dto.dateOfBirth);

    // Check all uniqueness constraints in parallel — one round-trip instead of three
    const [existingEmail, existingAadhaar, existingPan] = await Promise.all([
      this.usersRepository.findByEmail(dto.email),
      this.usersRepository.findByAadhaar(dto.aadhaarNumber),
      this.usersRepository.findByPan(dto.panNumber),
    ]);

    if (existingEmail) throw new EmailAlreadyExistsException(dto.email);
    if (existingAadhaar) throw new AadhaarAlreadyExistsException();
    if (existingPan) throw new PanAlreadyExistsException();

    const user = await this.usersRepository.create({
      ...dto,
      dateOfBirth: new Date(dto.dateOfBirth),
      createdBy: performedBy,
      updatedBy: performedBy,
    });

    await this.usersRepository.createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.CREATE,
      newData: this.sanitizeForAudit(user),
      performedBy,
    });

    this.logger.log(`User created: ${user.id}`);
    return { id: user.id };
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const allowedSortFields = ['firstName', 'lastName', 'email', 'createdAt', 'updatedAt'];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [users, totalRecords] = await this.usersRepository.findAllPaginated({
      skip,
      take: limit,
      orderBy: { [resolvedSortBy]: sortOrder } as Prisma.UserOrderByWithRelationInput,
    });

    return {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasNextPage: page * limit < totalRecords,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return user;
  }

  async update(id: string, dto: UpdateUserDto, performedBy?: string): Promise<void> {
    const existing = await this.usersRepository.findById(id);
    if (!existing) throw new UserNotFoundException(id);

    if (dto.dateOfBirth) {
      this.validateDateOfBirth(dto.dateOfBirth);
    }

    const updated = await this.usersRepository.update(id, {
      ...dto,
      ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
      updatedBy: performedBy,
      version: { increment: 1 },
    });

    await this.usersRepository.createAuditLog({
      userId: id,
      action: AUDIT_ACTIONS.UPDATE,
      oldData: this.sanitizeForAudit(existing),
      newData: this.sanitizeForAudit(updated),
      performedBy,
    });

    this.logger.log(`User updated: ${id}`);
  }

  async remove(id: string, performedBy?: string): Promise<void> {
    const existing = await this.usersRepository.findByIdIncludeDeleted(id);
    if (!existing) throw new UserNotFoundException(id);
    if (existing.isDeleted) throw new UserAlreadyDeletedException(id);

    await this.usersRepository.softDelete(id);

    await this.usersRepository.createAuditLog({
      userId: id,
      action: AUDIT_ACTIONS.DELETE,
      oldData: this.sanitizeForAudit(existing),
      performedBy,
    });

    this.logger.log(`User soft-deleted: ${id}`);
  }

  async search(dto: SearchUserDto): Promise<PaginatedResult<User>> {
    const { q = '', page = 1, limit = 10 } = dto;
    const skip = (page - 1) * limit;

    const [users, totalRecords] = await this.usersRepository.searchUsers({
      query: q,
      skip,
      take: limit,
    });

    return {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasNextPage: page * limit < totalRecords,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getAuditLogs(userId: string) {
    const user = await this.usersRepository.findByIdIncludeDeleted(userId);
    if (!user) throw new UserNotFoundException(userId);
    return this.usersRepository.findAuditLogs(userId);
  }

  private validateDateOfBirth(dateOfBirth: string): void {
    const dob = new Date(dateOfBirth);
    if (dob >= new Date()) {
      throw new BadRequestException('Date of birth cannot be in the future');
    }
  }

  // Mask Aadhaar in audit logs — only last 4 digits visible (PII protection)
  private sanitizeForAudit(user: User): Record<string, any> {
    const { aadhaarNumber, ...rest } = user as any;
    return {
      ...rest,
      aadhaarNumber: `XXXX-XXXX-${aadhaarNumber?.slice(-4)}`,
    };
  }
}
