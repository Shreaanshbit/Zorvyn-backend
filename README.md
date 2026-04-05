# Zorvyn - Role-Based Financial Dashboard Backend

**Live API:**  
https://zorvyn-backend-08dd.onrender.com

---

## Project Overview
Zorvyn is a role-based financial dashboard backend built using Node.js, Express, and MongoDB. The system enables users to manage financial records (income and expenses) and provides analytical insights through structured dashboard endpoints.

The application implements role-based access control to ensure that users interact with data according to their permissions.

---

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)

---

## Setup Process
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shreanshbit/Zorvyn-backend.git
   cd Zorvyn-backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file in the root directory:**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   ```
4. **Start the server:**
   ```bash
   npm run dev
   # or
   node src/server.js
   ```

---

## Authentication
JWT-based authentication is used for all protected routes.

A valid token must be included in the Authorization header:
```
Authorization: Bearer <token>
```
Inactive users are restricted from logging in and accessing protected APIs.

---

## API Explanation
### Authentication
- `POST /api/auth/register` — Registers a new user which is by default 'viewer' , user cannot self-register as 'admin' or 'analyst'.
- `POST /api/auth/login` — Authenticates a user and returns a JWT token.

### Financial Records
- `POST /api/records` — Creates a financial record. Accessible by Admin and Viewer.
- `GET /api/records` — Retrieves records.
  - Viewer: only their own records
  - Analyst/Admin: all records
- `PATCH /api/records/:id` — Updates a record. Accessible by Admin.
- `DELETE /api/records/:id` — Deletes a record. Accessible by Admin.

### Dashboard APIs
- `GET /api/dashboard/summary` — Returns the personal dashboard for the logged-in user. Includes:
  - total income
  - total expense
  - balance
  - category breakdown
  - monthly trends
  - recent activity
  - insights
- `GET /api/dashboard/overview` — Returns global system analytics. Accessible by Admin and Analyst.
- `GET /api/dashboard/users-overview` — Returns per-user aggregated statistics. Accessible by Admin and Analyst.
- `GET /api/dashboard/user/:id` — Returns detailed analytics for a specific user. Accessible by Admin and Analyst.

### User Management
- `GET /api/users` — Retrieves all users. Accessible by Admin.
- `PATCH /api/users/:id` — Updates user details such as role and status. Accessible by Admin.

---

## Role-Based Access Control

- **Viewer:** Can create records, view only personal financial data, and access the personal dashboard.
- **Analyst:** Has read-only access to all records and can access global analytics dashboards.
- **Admin:** Has full system access, including user management, record CRUD operations, dashboard access, and role promotion.

---

## Assumptions Made
- All users must be authenticated using JWT before accessing protected routes.
- Public registration always creates users with the 'viewer' role.
- Viewer users are restricted to their own data and cannot access other users’ information.
- Analyst users are strictly read-only and cannot modify any data.
- Admin users have full control over users and financial records.

---
## Architecture
- the backend is built  around “decision-making dashboards”, not around raw database operations.
- Role-based dashboards were separated instead of overloading a single endpoint  
- Viewer-specific data filtering ensures data privacy  
- Analyst role is strictly read-only for system integrity  
- Admin controls user lifecycle and system-wide data  
- Analytics logic implemented at backend level for scalability 

---
## Trade-offs Considered
- Centralized error middleware was not implemented to keep the codebase simpler and focused on assignment requirements.
- Pagination and advanced filtering were not included to maintain clarity and avoid unnecessary complexity.

---

## Project Structure
```
src/
├── models/
├── controllers/
├── routes/
├── middlewares/
├── utils/
├── app.js
└── server.js
```

---

## Testing
The API can be tested using Postman.

**Base URL:**
https://zorvyn-backend-08dd.onrender.com
