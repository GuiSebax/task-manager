# TaskManager

A full-stack personal task manager web application built as a portfolio project in 2026. Users can create, organize, filter, and track their tasks using categories, priorities, and due dates — with a clean professional dark UI and secure authentication.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Fastify](https://img.shields.io/badge/Fastify-5-black?style=flat-square&logo=fastify)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)

---

## Features

- 🔐 **Authentication** — Secure sign-in and sign-up with Clerk (JWT-based)
- ✅ **Task management** — Create, edit, delete and update task status
- 🏷️ **Categories** — Organize tasks with color-coded categories
- 🔍 **Filters** — Filter tasks by status and priority
- 📊 **Dashboard stats** — Overview of total, todo, in progress and done tasks
- 🌙 **Dark / Light mode** — Toggle between themes with one click
- 📱 **Responsive** — Works on desktop and mobile

---

## Tech Stack

### Frontend

- **Next.js 15** — React framework with App Router and SSR
- **TypeScript** — Type safety across the whole codebase
- **Tailwind CSS** — Utility-first styling
- **Clerk** — Authentication UI and session management
- **next-themes** — Dark/light mode support
- **Axios** — HTTP client for API calls

### Backend

- **Node.js + Fastify** — Fast, plugin-based REST API
- **TypeScript** — Fully typed backend
- **Zod** — Runtime schema validation
- **Prisma ORM** — Type-safe database queries and migrations
- **Clerk** — JWT verification middleware
- **@fastify/cors** — Cross-origin resource sharing

### Database & Infrastructure

- **PostgreSQL** — Primary relational database
- **Supabase** — Managed Postgres hosting
- **Vercel** — Frontend deployment
- **Railway** — Backend deployment

---

## Architecture

```
Browser (Next.js 15)
        │
        ▼
  Fastify REST API
  ├── Zod validation
  ├── Clerk JWT middleware
  └── Prisma ORM
        │
        ▼
  PostgreSQL (Supabase)
```

### Request flow

1. User authenticates via Clerk on the frontend
2. Clerk issues a signed JWT token
3. Frontend attaches the JWT to every API request
4. Fastify middleware verifies the token on every protected route
5. Prisma queries PostgreSQL and returns the data

---

## Database Schema

```prisma
model User {
  id         String     @id @default(uuid())
  email      String     @unique
  name       String
  clerkId    String     @unique
  tasks      Task[]
  categories Category[]
  createdAt  DateTime   @default(now())
}

model Category {
  id     String @id @default(uuid())
  name   String
  color  String
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks  Task[]
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(todo)
  priority    Priority   @default(medium)
  dueDate     DateTime?
  userId      String
  categoryId  String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

---

## API Routes

All routes require a valid Clerk JWT token in the `Authorization: Bearer <token>` header.

### Tasks

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/tasks`     | List all tasks    |
| GET    | `/tasks/:id` | Get a single task |
| POST   | `/tasks`     | Create a new task |
| PUT    | `/tasks/:id` | Update a task     |
| DELETE | `/tasks/:id` | Delete a task     |

### Categories

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/categories`     | List all categories   |
| POST   | `/categories`     | Create a new category |
| PUT    | `/categories/:id` | Update a category     |
| DELETE | `/categories/:id` | Delete a category     |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Clerk](https://clerk.com) account (free)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/task-manager.git
cd task-manager
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL="postgresql://..."
CLERK_SECRET_KEY=sk_test_...
```

Run the database migration:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` folder:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
task-manager/
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── dashboard/         # Main task list page
│   │   ├── tasks/new/         # Create task page
│   │   ├── categories/        # Category management page
│   │   ├── sign-in/           # Clerk sign-in page
│   │   └── sign-up/           # Clerk sign-up page
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation with theme toggle
│   │   └── TaskCard.tsx       # Task card component
│   └── lib/
│       ├── api.ts             # Axios instance with auth interceptor
│       ├── tasks.ts           # Task API functions
│       ├── categories.ts      # Category API functions
│       └── types.ts           # Shared TypeScript types
│
└── backend/                   # Fastify application
    ├── src/
    │   ├── routes/
    │   │   ├── tasks.ts       # Task CRUD routes
    │   │   └── categories.ts  # Category CRUD routes
    │   ├── schemas/
    │   │   ├── task.schema.ts      # Zod schemas for tasks
    │   │   └── category.schema.ts  # Zod schemas for categories
    │   ├── middlewares/
    │   │   └── auth.ts        # JWT verification middleware
    │   └── lib/
    │       └── prisma.ts      # Prisma client instance
    ├── prisma/
    │   └── schema.prisma      # Database models
    └── server.ts              # Fastify entry point
```

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com) — set root directory to `frontend`
- **Backend** → [Railway](https://railway.app) — set root directory to `backend`

---

## Author

Built by **Guilherme** as a portfolio project to demonstrate full-stack development skills with modern technologies in 2026.
