# EduMate API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

Access tokens expire in 7 days. Use the refresh endpoint to renew.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Study Planner](#study-planner)
3. [Tasks](#tasks)
4. [Notes](#notes)
5. [Goals](#goals)
6. [Analytics](#analytics)
7. [Admin](#admin)

---

## Authentication

### Register User
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/auth/register` |
| Auth | No |

**Request Body:**
```json
{
  "name": "Demo Student",
  "email": "student@edumate.com",
  "password": "Student@123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Demo Student",
    "email": "student@edumate.com",
    "role": "user",
    "status": "active",
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T08:00:00.000Z"
  }
}
```

---

### Login User
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/auth/login` |
| Auth | No |

**Request Body:**
```json
{
  "email": "student@edumate.com",
  "password": "Student@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Demo Student",
    "email": "student@edumate.com",
    "role": "user",
    "status": "active",
    "avatar": ""
  }
}
```

---

### Current User (Who Am I)
| Field | Value |
|-------|-------|
| Method | `GET` |
| Endpoint | `/auth/whoami` |
| Auth | Yes |

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Demo Student",
    "email": "student@edumate.com",
    "role": "user",
    "status": "active",
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T08:00:00.000Z"
  }
}
```

---

### Update Profile
| Field | Value |
|-------|-------|
| Method | `PUT` |
| Endpoint | `/auth/update` |
| Auth | Yes |
| Content-Type | `multipart/form-data` |

**Request Body (form-data):**
| Key | Type | Description |
|-----|------|-------------|
| name | text | Updated name |
| email | text | Updated email |
| avatar | file | Profile image (optional) |

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Updated Name",
    "email": "updated@edumate.com",
    "role": "user",
    "status": "active",
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T09:00:00.000Z"
  }
}
```

---

### Change Password
| Field | Value |
|-------|-------|
| Method | `PUT` |
| Endpoint | `/auth/update` |
| Auth | Yes |
| Content-Type | `multipart/form-data` |

**Request Body (form-data):**
| Key | Type | Description |
|-----|------|-------------|
| currentPassword | text | Current password |
| newPassword | text | New password (8+ chars, letter + number) |

**Success Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### Forgot Password
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/auth/forgot-password` |
| Auth | No |

**Request Body:**
```json
{
  "email": "student@edumate.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "If an account exists, a reset link has been sent.",
  "devToken": "386e181ceec0db577a1055a607614405469d5f21ffd51c44a974483e6d800bf9"
}
```

> Note: `devToken` is returned only in development for testing.

---

### Reset Password
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/auth/reset-password/:token` |
| Auth | No |

**Request Body:**
```json
{
  "password": "NewStudent@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### Refresh Token
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/auth/refresh` |
| Auth | No (requires `edumate_refresh_token` cookie) |

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/auth/logout` |
| Auth | No |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Study Planner

### Create Study Plan
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/study-plans` |
| Auth | Yes |

**Request Body:**
```json
{
  "title": "Midterm Prep",
  "subject": "Mathematics",
  "topic": "Calculus",
  "deadline": "2026-08-15",
  "studyHours": 10,
  "priority": "high",
  "progress": 0
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Midterm Prep",
    "subject": "Mathematics",
    "topic": "Calculus",
    "description": "",
    "studyHours": 10,
    "priority": "high",
    "deadline": "2026-08-15T00:00:00.000Z",
    "status": "not-started",
    "progress": 0,
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T08:00:00.000Z"
  }
}
```

---

### Get Study Plans
| Field | Value |
|-------|-------|
| Method | `GET` |
| Endpoint | `/study-plans` |
| Auth | Yes |

**Success Response (200):**
```json
{
  "success": true,
  "data": [ /* array of StudyPlanResponse */ ]
}
```

---

## Tasks

### Create Task
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/tasks` |
| Auth | Yes |

**Request Body:**
```json
{
  "title": "Write Essay",
  "description": "History essay",
  "subject": "History",
  "dueDate": "2026-08-02",
  "priority": "high",
  "status": "pending"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Write Essay",
    "description": "History essay",
    "category": "study",
    "priority": "high",
    "dueDate": "2026-08-02T00:00:00.000Z",
    "status": "pending",
    "isRecurring": false,
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T08:00:00.000Z"
  }
}
```

---

## Notes

### Create Note
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/notes` |
| Auth | Yes |

**Request Body:**
```json
{
  "title": "Lecture Notes",
  "content": "Key concepts from today",
  "tag": "Data Structures",
  "favorite": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Lecture Notes",
    "content": "Key concepts from today",
    "tag": "Data Structures",
    "favorite": true,
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T08:00:00.000Z"
  }
}
```

---

## Goals

### Create Goal
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/goals` |
| Auth | Yes |

**Request Body:**
```json
{
  "title": "Read 5 Books",
  "description": "Finish reading by month end",
  "target": 5,
  "current": 0,
  "unit": "books",
  "type": "monthly",
  "deadline": "2026-08-31"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Read 5 Books",
    "description": "Finish reading by month end",
    "type": "monthly",
    "target": 5,
    "current": 0,
    "unit": "books",
    "deadline": "2026-08-31T00:00:00.000Z",
    "status": "active",
    "progressPct": 0,
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T08:00:00.000Z"
  }
}
```

---

## Analytics

### Get Analytics Overview
| Field | Value |
|-------|-------|
| Method | `GET` |
| Endpoint | `/analytics` |
| Auth | Yes |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "studyHours": 120,
    "tasksCompleted": 45,
    "goalsAchieved": 12,
    "streak": 8
  }
}
```

---

## Admin

> All admin endpoints require `Authorization: Bearer <admin_token>` and role `admin`.

### List Users
| Field | Value |
|-------|-------|
| Method | `GET` |
| Endpoint | `/admin/users?page=1&limit=10&search=` |
| Auth | Yes (Admin) |

**Query Parameters:**
| Param | Description |
|-------|-------------|
| page | Page number (default: 1) |
| limit | Items per page (default: 10) |
| search | Search by name or email (optional) |

**Success Response (200):**
```json
{
  "success": true,
  "data": [ /* array of users */ ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "totalPages": 1
  }
}
```

---

### Create User
| Field | Value |
|-------|-------|
| Method | `POST` |
| Endpoint | `/admin/users` |
| Auth | Yes (Admin) |

**Request Body:**
```json
{
  "name": "New Student",
  "email": "newstudent@edumate.com",
  "password": "Student@123",
  "role": "user",
  "status": "active"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "New Student",
    "email": "newstudent@edumate.com",
    "role": "user",
    "status": "active",
    "createdAt": "2026-07-28T08:00:00.000Z",
    "updatedAt": "2026-07-28T08:00:00.000Z"
  }
}
```

---

### Update User
| Field | Value |
|-------|-------|
| Method | `PUT` |
| Endpoint | `/admin/users/:id` |
| Auth | Yes (Admin) |

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "admin",
  "status": "active"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { /* updated user object */ }
}
```

---

### Delete User
| Field | Value |
|-------|-------|
| Method | `DELETE` |
| Endpoint | `/admin/users/:id` |
| Auth | Yes (Admin) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Demo Credentials

### Admin User
| Field | Value |
|-------|-------|
| Email | `admin@edumate.com` |
| Password | `Admin@12345` |
| Role | `admin` |

### Student User
| Field | Value |
|-------|-------|
| Email | `student@edumate.com` |
| Password | `Student@123` |
| Role | `user` |

---

## Demo Flow

### Step 1: Register
```
POST /auth/register
Body: { "name": "Demo Student", "email": "student@edumate.com", "password": "Student@123" }
```

### Step 2: Login
```
POST /auth/login
Body: { "email": "student@edumate.com", "password": "Student@123" }
```

### Step 3: Copy JWT Token
Copy the `token` from login response into Postman `token` environment variable.

### Step 4: Access Protected Routes
```
GET /auth/whoami
Header: Authorization: Bearer {{token}}
```

### Step 5: Update Profile
```
PUT /auth/update
Header: Authorization: Bearer {{token}}
Form-Data: name=Updated Name&email=updated@edumate.com
```

### Step 6: Change Password
```
PUT /auth/update
Header: Authorization: Bearer {{token}}
Form-Data: currentPassword=Student@123&newPassword=NewStudent@123
```

### Step 7: Forgot Password
```
POST /auth/forgot-password
Body: { "email": "student@edumate.com" }
Copy devToken from response
```

### Step 8: Reset Password
```
POST /auth/reset-password/{{resetToken}}
Body: { "password": "NewStudent@123" }
```

### Step 9: Create Study Plan
```
POST /study-plans
Header: Authorization: Bearer {{token}}
Body: { "title": "Midterm Prep", "subject": "Math", "topic": "Calculus", "deadline": "2026-08-15" }
```

### Step 10: Create Task
```
POST /tasks
Header: Authorization: Bearer {{token}}
Body: { "title": "Write Essay", "subject": "History", "priority": "high", "status": "pending" }
```

### Step 11: Create Note
```
POST /notes
Header: Authorization: Bearer {{token}}
Body: { "title": "Lecture Notes", "content": "Key concepts", "tag": "Data Structures", "favorite": true }
```

### Step 12: View Analytics
```
GET /analytics
Header: Authorization: Bearer {{token}}
```

### Step 13: Admin Operations
```
GET /admin/users
Header: Authorization: Bearer {{adminToken}}
```

---

## Test Results

| Endpoint | Status |
|----------|--------|
| POST /auth/register | 201 |
| POST /auth/login | 200 |
| GET /auth/whoami | 200 |
| PUT /auth/update | 200 |
| POST /auth/forgot-password | 200 |
| POST /auth/reset-password/:token | 200 |
| POST /auth/refresh | 200 |
| POST /auth/logout | 200 |
| GET /study-plans | 200 |
| POST /study-plans | 201 |
| GET /tasks | 200 |
| POST /tasks | 201 |
| GET /notes | 200 |
| POST /notes | 201 |
| GET /goals | 200 |
| POST /goals | 201 |
| GET /analytics | 200 |
| GET /admin/users | 200 |

---

## Backend Health Report

- Backend Server: Running on port 5000
- Database: MongoDB Connected
- Frontend: Running on port 3000
- TypeScript: Clean (no errors)
- All APIs tested and verified

