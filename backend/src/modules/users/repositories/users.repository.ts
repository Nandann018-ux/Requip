import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, User, UserAuditLog } from '@prisma/client';
import { AuditAction } from '../../../common/constants/audit-actions';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async findByIdIncludeDeleted(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  }

  async findByAadhaar(aadhaarNumber: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { aadhaarNumber, isDeleted: false },
    });
  }

  async findByPan(panNumber: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { panNumber, isDeleted: false },
    });
  }

  async findAllPaginated(params: {
    skip: number;
    take: number;
    orderBy: Prisma.UserOrderByWithRelationInput;
    where?: Prisma.UserWhereInput;
  }): Promise<[User[], number]> {
    const { skip, take, orderBy, where } = params;
    const baseWhere: Prisma.UserWhereInput = { isDeleted: false, ...where };

    return this.prisma.$transaction([
      this.prisma.user.findMany({ where: baseWhere, skip, take, orderBy }),
      this.prisma.user.count({ where: baseWhere }),
    ]);
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }

  async createAuditLog(data: {
    userId: string;
    action: AuditAction;
    oldData?: Record<string, any>;
    newData?: Record<string, any>;
    performedBy?: string;
  }): Promise<UserAuditLog> {
    return this.prisma.userAuditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        oldData: data.oldData ?? Prisma.JsonNull,
        newData: data.newData ?? Prisma.JsonNull,
        performedBy: data.performedBy,
      },
    });
  }

  async findAuditLogs(userId: string): Promise<UserAuditLog[]> {
    return this.prisma.userAuditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchUsers(params: {
    query: string;
    skip: number;
    take: number;
  }): Promise<[User[], number]> {
    const { query, skip, take } = params;
    const where: Prisma.UserWhereInput = {
      isDeleted: false,
      OR: [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { email: { contains: query } },
        { panNumber: { contains: query } },
        { aadhaarNumber: { contains: query } },
        { primaryMobile: { contains: query } },
        { secondaryMobile: { contains: query } },
      ],
    };

    return this.prisma.$transaction([
      this.prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);
  }
}
