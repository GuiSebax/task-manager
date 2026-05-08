# Task Manager

A personal task manager web application built as a portfolio project in 2026. Users can create, organize, filter, and track their tasks using categories, priorities, and due dates.

---

## What is this project?

This is a full-stack web app where each authenticated user has their own private workspace. They can manage tasks and organize them into custom categories. Think of it as a simplified personal version of Todoist or TickTick — but built entirely from scratch.

### What a user can do

- Create an account and log in securely
- Create tasks with a title, description, due date, priority, and category
- Update task status: `todo` → `in_progress` → `done`
- Filter and sort tasks by status, priority, category, or due date
- Create color-coded categories (Work, Personal, Study, etc.)
- Edit and delete tasks and categories
- See only their own data — completely isolated per user

---

## Tech Stack

### Frontend

| Technology   | Role                                              |
| ------------ | ------------------------------------------------- |
| Next.js 15   | React framework — handles routing, SSR, and pages |
| TypeScript   | Type safety across the whole codebase             |
| Tailwind CSS | Utility-first styling                             |
| shadcn/ui    | Accessible, customizable UI components            |

### Backend

| Technology        | Role                                                            |
| ----------------- | --------------------------------------------------------------- |
| Node.js + Fastify | API server — fast, plugin-based, TypeScript native              |
| Zod               | Schema validation — one schema = runtime check + TS types       |
| Prisma ORM        | Type-safe database queries and migrations                       |
| Clerk             | Authentication — JWT-based auth without writing it from scratch |
| Redis             | Rate limiting and session storage                               |

### Database & Hosting

| Technology | Role                                        |
| ---------- | ------------------------------------------- |
| PostgreSQL | Primary relational database                 |
| Supabase   | Managed Postgres — free hosting + dashboard |
| Vercel     | Frontend deployment                         |
| Railway    | Backend + Redis deployment                  |

---

## Architecture Overview

```
Browser (Next.js)
      │
      ▼
Fastify API  ──► Redis (sessions / rate limiting)
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL (Supabase)
```

### Request flow

1. User opens the app — Next.js renders the page
2. User action triggers an API call from the frontend
3. Fastify receives the request, runs Zod validation, verifies the JWT via Clerk middleware
4. If valid, Prisma queries PostgreSQL and returns the data
5. Response flows back to the frontend and the UI updates

### Authentication flow (JWT)

1. User logs in via Clerk (email/password or OAuth)
2. Clerk issues a signed JWT token
3. Frontend attaches the JWT to every API request (`Authorization: Bearer <token>`)
4. Fastify middleware verifies the JWT on every protected route
5. If invalid or expired → `401 Unauthorized`. If valid → request proceeds
6. User identity is extracted from the token — no extra DB lookup needed

---

## Folder Structure

### Frontend (Next.js)

```
frontend/
├── app/
│   ├── (auth)/           # Login and register (handled by Clerk)
│   ├── dashboard/        # Main task list page
│   ├── tasks/
│   │   └── [id]/         # Task detail and edit page
│   └── categories/       # Category management page
├── components/           # Reusable UI components
│   ├── TaskCard.tsx
│   ├── CategoryBadge.tsx
│   └── FilterBar.tsx
└── lib/
    ├── api.ts            # Functions to call the Fastify API
    └── types.ts          # Shared TypeScript types
```

### Backend (Fastify)

```
backend/
├── routes/
│   ├── tasks.ts          # CRUD routes for tasks
│   └── categories.ts     # CRUD routes for categories
├── schemas/
│   ├── task.schema.ts    # Zod schemas for task validation
│   └── category.schema.ts
├── middlewares/
│   ├── auth.ts           # JWT verification via Clerk
│   └── error.ts          # Global error handler
├── prisma/
│   ├── schema.prisma     # Database models and relations
│   └── migrations/       # Auto-generated migration files
└── server.ts             # Fastify app entry point
```

---

## API Routes

All routes are protected by JWT middleware. Every request must include a valid Clerk token.

### Tasks

| Method | Endpoint     | Description                           |
| ------ | ------------ | ------------------------------------- |
| GET    | `/tasks`     | List all tasks for the logged-in user |
| GET    | `/tasks/:id` | Get a single task by ID               |
| POST   | `/tasks`     | Create a new task (Zod validated)     |
| PUT    | `/tasks/:id` | Update a task                         |
| DELETE | `/tasks/:id` | Delete a task                         |

### Categories

| Method | Endpoint          | Description                                |
| ------ | ----------------- | ------------------------------------------ |
| GET    | `/categories`     | List all categories for the logged-in user |
| POST   | `/categories`     | Create a new category                      |
| PUT    | `/categories/:id` | Update a category                          |
| DELETE | `/categories/:id` | Delete a category                          |

---

## Database Schema

Three tables with clear relationships:

- `User` has many `Tasks`
- `User` has many `Categories`
- `Category` has many `Tasks`
- `Task` belongs to one `User` and optionally one `Category`

See `schema.prisma` for the full Prisma schema.

---

## Suggested Build Order

1. Set up Fastify + Prisma + connect to Supabase
2. Add Clerk authentication + JWT middleware
3. Build task CRUD routes with Zod validation
4. Build Next.js frontend page by page (dashboard first)
5. Add categories and filtering
6. Deploy: Vercel (frontend) + Railway (backend)

---

## Why this project for a portfolio?

A well-executed task manager hits every technical checkbox a recruiter or tech lead looks for in a mid-level developer: authentication, a relational data model with foreign keys, a REST API with proper validation, a frontend that talks to a backend, CRUD operations, filtering, and a live deployed URL.

It also demonstrates deliberate technology choices — Fastify over Express for performance and plugin architecture, Zod for a single source of truth on data contracts, Prisma for type-safe database access — which makes for strong talking points in technical interviews.
