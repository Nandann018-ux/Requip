# User Management System

Production-ready full-stack User Management System — NestJS + Prisma + MySQL + React.

## Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌───────────┐
│  React UI   │───▶│  NestJS API     │───▶│  MySQL 8  │
│  Port 3000  │    │  Port 3001      │    │  Port 3306│
└─────────────┘    └─────────────────┘    └───────────┘
                          │
                   ┌──────▼──────┐
                   │  Prisma ORM │
                   └─────────────┘
```

## Quick Start (Docker — one command)

```bash
cp backend/.env.example backend/.env
docker-compose up -d
# Wait ~30s for MySQL healthcheck, then run migrations:
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed   # optional seed data
```

- App: http://localhost:3000
- API: http://localhost:3001/api/v1
- Swagger: http://localhost:3001/api/docs

## Local Development

### Backend

```bash
cd backend
cp .env.example .env          # set DATABASE_URL
npm install
npx prisma migrate dev        # run migrations
npm run start:dev             # hot-reload dev server
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/users | Create user |
| GET | /api/v1/users?page=1&limit=10 | List users (paginated) |
| GET | /api/v1/users/search?q=nandan | Search users |
| GET | /api/v1/users/:id | Get user by ID |
| PUT | /api/v1/users/:id | Update user |
| DELETE | /api/v1/users/:id | Soft-delete user |
| GET | /api/v1/users/:id/audit-logs | Get audit trail |
| GET | /api/v1/health | Health check |

## Running Tests

```bash
cd backend
npm run test          # unit tests
npm run test:cov      # with coverage report
```

## Validation Rules

| Field | Rule |
|-------|------|
| Email | Valid RFC email format |
| Aadhaar | Exactly 12 digits (`^\d{12}$`) |
| PAN | `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` |
| Mobile | Indian format: starts 6-9, 10 digits (`^[6-9]\d{9}$`) |
| Date of Birth | Must be a past date |

## Pain Points & Learnings

### Challenges Encountered

**1. Aadhaar is sensitive PII**
Storing raw 12-digit Aadhaar in DB creates compliance risk. In production, encrypt at rest with AES-256. Here we mask it in audit logs (shows only last 4 digits: `XXXX-XXXX-1234`).

**2. Unique constraints + soft delete conflict**
When a user is soft-deleted, their email/Aadhaar/PAN still exist in the DB with unique constraints. A re-registration would fail at the DB level. Solution: perform uniqueness checks in the service layer filtering `isDeleted: false`, not at the DB constraint level.

**3. Sort field injection**
Allowing arbitrary `sortBy` query params risks query manipulation. Solved with an explicit allowlist (`['firstName', 'lastName', 'email', 'createdAt', 'updatedAt']`) in the service — unknown fields default to `createdAt`.

**4. Parallel uniqueness checks**
Naive implementation makes 3 sequential DB calls before creating a user. Using `Promise.all` runs all 3 in parallel — one round-trip latency instead of three.

**5. Optimistic concurrency**
The `version` field increments on every update. Schema is ready for optimistic locking (detect concurrent edits) without full implementation overhead.

**6. UUID vs auto-increment**
UUIDs prevent ID enumeration attacks and work across distributed systems, but are 36 chars vs 8 bytes. Index overhead is real but worth it for security at this scale.

**7. Test isolation**
Unit tests mock the repository layer entirely — service logic is tested independently of Prisma/MySQL. This makes tests fast and deterministic but requires careful mock hygiene (`jest.clearAllMocks()` in `beforeEach`).

### Learnings

1. **Repository pattern** decouples DB query logic from business logic — both become independently testable.
2. **DTO whitelist + `forbidNonWhitelisted`** prevents mass assignment vulnerabilities at the framework level.
3. **Global exception filter** ensures every error (including unhandled ones) returns a consistent `{ success, statusCode, message, errors }` envelope.
4. **Audit logging in the service layer** (not DB triggers) gives semantic context: who did what, what changed, old vs new values.
5. **Soft delete** preserves data for compliance and audit. `isDeleted` index keeps filtered queries fast.
6. **Input transforms** (`trim`, `toLowerCase`) on DTOs prevent whitespace/case bugs before data hits the DB.

## Best Practices Checklist

- ✅ UUID primary keys (no sequential ID enumeration)
- ✅ DTO validation with `class-validator`
- ✅ Global exception filter (consistent error format)
- ✅ Pagination with `hasNextPage` / `hasPreviousPage`
- ✅ Soft delete with `deletedAt` timestamp
- ✅ Audit trail table (`user_audit_logs`) with old/new data diff
- ✅ Aadhaar masking in logs (PII protection)
- ✅ Environment variables via `.env` (never hardcoded)
- ✅ Swagger/OpenAPI documentation
- ✅ Unit tests for service + controller (Jest)
- ✅ Dockerized deployment (one-command startup)
- ✅ Repository pattern (testable, maintainable)
- ✅ Consistent API response envelope (`success`, `data`, `message`)
- ✅ Database indexes on all search/filter fields
- ✅ TypeScript strict mode (`noImplicitAny`, `strictNullChecks`)
- ✅ ESLint + Prettier
- ✅ GitHub Actions CI/CD
- ✅ Search endpoint (name, email, PAN, Aadhaar, mobile)
- ✅ Health check endpoint
- ✅ Rate limiting (ThrottlerModule — 100 req/min)
- ✅ Security headers (Helmet)
- ✅ Input sanitization (trim/lowercase transforms on DTOs)
- ✅ Versioned API (`/api/v1/`)
- ✅ Immutable fields (email, Aadhaar, PAN post-creation)
- ✅ Optimistic concurrency via `version` field
- ✅ Parallel uniqueness checks (`Promise.all`)
- ✅ Sort field allowlist (prevents query injection)
