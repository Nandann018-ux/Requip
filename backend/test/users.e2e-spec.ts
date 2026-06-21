import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

/**
 * Integration tests — require a real MySQL database.
 * Set DATABASE_URL env var to a test DB before running:
 *   DATABASE_URL="mysql://root:password@localhost:3306/user_management_test" npm run test:e2e
 */
describe('Users API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdUserId: string;

  const testUser = {
    firstName: 'Integration',
    lastName: 'Test',
    email: `integration-${Date.now()}@test.com`,
    primaryMobile: '9876543210',
    aadhaarNumber: `${Date.now()}`.padStart(12, '1').slice(0, 12),
    panNumber: 'INTEG1234T',
    dateOfBirth: '1995-06-15',
    placeOfBirth: 'Bangalore',
    currentAddress: '1 Test Street, Bangalore',
    permanentAddress: '1 Test Street, Bangalore',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up test data
    if (createdUserId) {
      await prisma.userAuditLog.deleteMany({ where: { userId: createdUserId } });
      await prisma.user.deleteMany({ where: { id: createdUserId } });
    }
    await app.close();
  });

  describe('Health Check', () => {
    it('GET /api/v1/health — should return ok', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a user and return id', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User created successfully');
      expect(res.body.data.id).toBeDefined();

      createdUserId = res.body.data.id;
    });

    it('should reject duplicate email with 409', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(testUser)
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('should reject invalid Aadhaar (not 12 digits) with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ ...testUser, email: 'new@test.com', aadhaarNumber: '123' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should reject invalid PAN format with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ ...testUser, email: 'new2@test.com', panNumber: 'INVALID' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject future date of birth with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ ...testUser, email: 'new3@test.com', dateOfBirth: '2099-01-01' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject invalid mobile (starts with 5) with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({ ...testUser, email: 'new4@test.com', primaryMobile: '5123456789' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return paginated user list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users?page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
      expect(typeof res.body.pagination.totalRecords).toBe('number');
    });

    it('should respect limit param', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users?page=1&limit=1')
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should reject limit > 100 with 400', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users?limit=200')
        .expect(400);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdUserId);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid UUID', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/not-a-uuid')
        .expect(400);
    });
  });

  describe('GET /api/v1/users/search', () => {
    it('should find user by first name', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users/search?q=Integration')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return empty for no match', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users/search?q=xyznonexistent')
        .expect(200);

      expect(res.body.data.length).toBe(0);
    });

    it('should reject query shorter than 2 chars with 400', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/search?q=a')
        .expect(400);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user fields', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/users/${createdUserId}`)
        .send({ firstName: 'Updated', placeOfBirth: 'Mumbai' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User updated successfully');
    });

    it('should reflect updated data in GET', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}`)
        .expect(200);

      expect(res.body.data.firstName).toBe('Updated');
      expect(res.body.data.placeOfBirth).toBe('Mumbai');
    });

    it('should reject updating email (immutable) with 400', async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/users/${createdUserId}`)
        .send({ email: 'newemail@test.com' })
        .expect(400);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .send({ firstName: 'Ghost' })
        .expect(404);
    });
  });

  describe('GET /api/v1/users/:id/audit-logs', () => {
    it('should return audit trail with CREATE and UPDATE entries', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}/audit-logs`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const actions = res.body.data.map((log: { action: string }) => log.action);
      expect(actions).toContain('CREATE');
      expect(actions).toContain('UPDATE');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft-delete user', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/v1/users/${createdUserId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User deleted successfully');
    });

    it('should not appear in GET /users after soft delete', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(200);

      const ids = res.body.data.map((u: { id: string }) => u.id);
      expect(ids).not.toContain(createdUserId);
    });

    it('should return 404 for GET after soft delete', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}`)
        .expect(404);
    });

    it('should return 400 on double soft-delete', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${createdUserId}`)
        .expect(400);
    });

    it('should have DELETE entry in audit log', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}/audit-logs`)
        .expect(200);

      const actions = res.body.data.map((log: { action: string }) => log.action);
      expect(actions).toContain('DELETE');
    });
  });
});
