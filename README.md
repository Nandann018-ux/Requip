<div align="center">

<img src=".github/assets/users-list.png" alt="UserVault — User Directory" width="100%" />

# UserVault

**Production-grade Identity Management System**

NestJS · Prisma · MySQL 8 · React · Material UI · Docker

[![Node](https://img.shields.io/badge/Node-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docker.com)

</div>

---

## Screenshots

<table>
  <tr>
    <td align="center"><strong>User Directory</strong></td>
    <td align="center"><strong>Create User</strong></td>
  </tr>
  <tr>
    <td><img src=".github/assets/users-list.png" alt="User Directory" /></td>
    <td><img src=".github/assets/create-user.png" alt="Create User Form" /></td>
  </tr>
</table>

---

## Features

| Category | What's included |
|----------|----------------|
| **CRUD** | Create, read, update, soft-delete users |
| **Search** | Real-time debounced search across name, email, PAN, Aadhaar, mobile |
| **Audit Trail** | Every mutation logged with old/new data diff in `user_audit_logs` |
| **Validation** | Aadhaar (12 digits), PAN (`ABCDE1234F`), Indian mobile, future-DOB guard |
| **Security** | Helmet headers · CORS · rate limiting (100 req/min) · UUID primary keys |
| **PII safety** | Aadhaar masked in audit logs (`XXXX-XXXX-1234`) |
| **API** | REST · Swagger/OpenAPI · URI versioning (`/api/v1/`) · consistent envelope |
| **Testing** | Unit tests (Jest) · Integration tests (Supertest e2e) |
| **DevOps** | Multi-stage Docker build · Docker Compose · GitHub Actions CI |
| **UX** | Animated splash screen · skeleton loading · real-time search feedback |

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│  React 18 + MUI + React Query + Zod   :3000      │
│  Vite dev proxy → /api → :3001                   │
└────────────────────┬─────────────────────────────┘
                     │ HTTP /api/v1
┌────────────────────▼─────────────────────────────┐
│  NestJS 10 + TypeScript                :3001      │
│  ├── UsersController  (HTTP layer)                │
│  ├── UsersService     (business logic)            │
│  ├── UsersRepository  (Prisma queries)            │
│  └── Prisma ORM                                   │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│  MySQL 8                               :3306      │
│  ├── users (soft-delete, versioned)               │
│  └── user_audit_logs                              │
└──────────────────────────────────────────────────┘
```

---

## Quick Start

### Option A — Docker *(recommended)*

> Requirements: Docker + Docker Compose

```bash
# 1. Clone
git clone https://github.com/Nandann018-ux/Requip.git
cd Requip

# 2. Copy env (credentials already match docker-compose)
cp backend/.env.example backend/.env

# 3. Boot everything — MySQL, backend (auto-migrates), frontend
docker-compose up -d

# 4. Seed 63 demo users (optional)
docker-compose exec backend npm run prisma:seed
```

| Service | URL |
|---------|-----|
| **UI** | http://localhost:3000 |
| **REST API** | http://localhost:3001/api/v1 |
| **Swagger** | http://localhost:3001/api/docs |

> On first boot the backend waits for the MySQL healthcheck (~20s), then automatically runs `prisma migrate deploy` before starting.

---

### Option B — Local Development

> Requirements: Node 18+, MySQL 8 running (easiest: start it via Docker below)

**Step 1 — Start MySQL only**

```bash
docker-compose up mysql -d
# wait ~15s until healthy
```

**Step 2 — Backend**

```bash
cd backend
cp .env.example .env          # creds: appuser / apppassword @ localhost:3306
npm install                   # auto-generates Prisma client (prepare hook)
npx prisma migrate dev        # apply schema migrations
npm run prisma:seed           # optional: seed 63 demo users
npm run start:dev             # hot-reload at :3001
```

**Step 3 — Frontend** *(new terminal)*

```bash
cd frontend
npm install
npm run dev                   # Vite at :3000, proxies /api → :3001
```

Open **http://localhost:3000**

---

## API Reference

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users` | Create a new user |
| `GET` | `/api/v1/users?page=1&limit=10&sortBy=createdAt&sortOrder=desc` | List users (paginated) |
| `GET` | `/api/v1/users/search?q=nandan&page=1&limit=10` | Full-text search |
| `GET` | `/api/v1/users/:id` | Get user by UUID |
| `PUT` | `/api/v1/users/:id` | Update user (email/Aadhaar/PAN immutable) |
| `DELETE` | `/api/v1/users/:id` | Soft-delete (data preserved) |
| `GET` | `/api/v1/users/:id/audit-logs` | Audit trail for a user |
| `GET` | `/api/v1/health` | Health check |

### Response envelope

```json
{
  "success": true,
  "data": { ... },
  "message": "User created successfully",
  "timestamp": "2026-06-21T12:00:00.000Z",
  "path": "/api/v1/users"
}
```

---

## Validation Rules

| Field | Rule | Mutable? |
|-------|------|----------|
| `email` | Valid RFC email | ❌ Immutable |
| `aadhaarNumber` | Exactly 12 digits | ❌ Immutable |
| `panNumber` | `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` | ❌ Immutable |
| `primaryMobile` | Indian 10-digit, starts 6–9 | ✅ |
| `dateOfBirth` | Must be a past date | ✅ |

---

## Running Tests

```bash
cd backend

# Unit tests (service + controller, fully mocked)
npm run test

# Unit tests with coverage report
npm run test:cov

# Integration / e2e tests (requires MySQL running)
npm run test:e2e
```

---

## Project Structure

```
user-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # User + UserAuditLog models
│   │   ├── seed.ts                # 63 demo users
│   │   └── migrations/
│   ├── src/
│   │   ├── modules/users/
│   │   │   ├── controllers/       # HTTP layer
│   │   │   ├── services/          # Business logic
│   │   │   ├── repositories/      # Prisma queries
│   │   │   ├── dto/               # Validation DTOs
│   │   │   └── tests/             # Unit tests
│   │   └── common/
│   │       ├── filters/           # Global exception filter
│   │       └── interceptors/      # Response + logging
│   ├── test/                      # e2e integration tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/                 # UserList, CreateUser, EditUser
│   │   ├── components/            # Navbar, UserForm, ConfirmDialog, LoadingPage
│   │   ├── api/                   # Axios client
│   │   ├── types/                 # TypeScript interfaces
│   │   └── theme.ts               # MUI design system
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .github/
    ├── workflows/ci.yml           # Backend tests + lint CI
    └── assets/                    # README screenshots
```

---

## Key Design Decisions

**Repository Pattern** — `UsersRepository` isolates all Prisma queries from `UsersService`. Both layers are independently unit-testable.

**Soft Delete** — Users are never hard-deleted. `isDeleted` + `deletedAt` fields preserve data for compliance. Uniqueness checks (email/Aadhaar/PAN) filter on `isDeleted: false` so deleted identifiers can be re-registered.

**Audit Trail** — Every `create`, `update`, `delete` writes to `user_audit_logs` with masked old/new values. Aadhaar stored as `XXXX-XXXX-1234` in logs.

**Parallel Uniqueness Checks** — Before create, three uniqueness checks run in `Promise.all` — one round-trip, not three.

**Immutable Identity Fields** — `UpdateUserDto` uses `OmitType(CreateUserDto, ['email','aadhaarNumber','panNumber'])` — framework-level enforcement, not application logic.

**Sort Field Allowlist** — `sortBy` is validated against an explicit set to prevent query injection.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 22 |
| Backend framework | NestJS 10 + TypeScript |
| ORM | Prisma 5 |
| Database | MySQL 8.0 |
| Frontend framework | React 18 + Vite |
| UI library | Material UI v5 |
| Data fetching | TanStack React Query v5 |
| Form handling | React Hook Form + Zod |
| HTTP client | Axios |
| Testing | Jest + Supertest |
| Container | Docker + Docker Compose |
| CI | GitHub Actions |

---

<div align="center">

Built by **Nandan Acharya**

</div>
