# Edumate

Smart study planner app — Sprint 2 authentication (registration & login).

## Project Structure

```
edumate-web/
├── frontend/          # Next.js + React + Tailwind (port 3000)
│   ├── app/           # Pages (login, register, dashboard)
│   └── src/           # API, actions, schemas, types
├── backend/           # Express + MongoDB + JWT (port 5000)
│   └── src/           # Models, controllers, routes
└── package.json       # Root scripts to run both apps
```

## Prerequisites

- Node.js 20+
- MongoDB running locally or a remote `MONGODB_URI`

## Setup

### 1. Install dependencies

From the repository root:

```bash
npm run install:all
```

Or install each app separately:

```bash
npm install --prefix frontend
npm install --prefix backend
```

### 2. Environment variables

**Backend** — copy and edit `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/edumate
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:3000
```

**Frontend** — copy and edit `frontend/.env.local.example`:

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Apps

From the repository root:

```bash
# Frontend only (http://localhost:3000)
npm run dev:frontend

# Backend only (http://localhost:5000)
npm run dev:backend
```

Run both in separate terminals for the full auth flow.

## Auth Flow

1. **Register** — `http://localhost:3000/register`
2. **Login** — `http://localhost:3000/login`
3. **Dashboard** — `http://localhost:3000/dashboard` (requires `edumate_session` cookie)

## API Endpoints

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/auth/register`  | Create new account |
| POST   | `/api/auth/login`     | Login, returns JWT |
| GET    | `/api/health`         | Health check       |
