# PawHaven — Pet Adoption Management System

A beginner-friendly full-stack Java project for managing shelter pets and adoption requests.

## Technology stack
- **Frontend:** React + Vite, React Router, Fetch API
- **Backend:** Java 17, Spring Boot 3.4, Spring Web, Spring Security, Spring Data JPA, Hibernate
- **Database:** MySQL
- **Security:** JWT authentication, BCrypt password hashing, role-based authorization
- **Validation/testing:** Jakarta Bean Validation, Postman

## Units covered (Units 1–6 only)
1. React components, props/state, routing, and REST communication.
2. CRUD operations for pets and adoption requests.
3. Forms, validation, DTOs, and centralized exception handling.
4. JPA entities/relationships, pagination, and sorting.
5. Registration/login, roles, and protected frontend routes.
6. JWT security, password hashing, and backend authorization.

**Unit 7 is intentionally excluded.**

## Roles
- `ADOPTER`: browse pets and submit adoption requests; view own requests.
- `SHELTER`: create/update/delete pets and review requests for their pets.
- `ADMIN`: view/manage all pets and adoption requests.

New public registrations are assigned the `ADOPTER` role. For development, register an account, then use the SQL below to promote it to SHELTER or ADMIN.

## Prerequisites
- Java 17+
- MySQL 8+
- Node.js 20+ and npm
- Maven (or use the Maven Wrapper if you add one)

## 1. Create the database
Start MySQL and run:

```sql
CREATE DATABASE pawhaven_db;
```

## 2. Configure the backend
Open `backend/src/main/resources/application.properties`.

The default local configuration expects:
- MySQL database: `pawhaven_db`
- Username: `root`
- Password: `password`

Change the password to your local MySQL password, or set environment variables:
- `DB_URL` (optional; default is `jdbc:mysql://localhost:3306/pawhaven_db`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET` (must be a long secret; default development value is provided)

Never use the development JWT secret or example database password in production.

## 3. Run the backend
From the `backend` directory:

```bash
mvn spring-boot:run
```

Backend base URL: `http://localhost:8080`

Check: `GET http://localhost:8080/api/pets` should return a page of pets. The first run creates tables and inserts sample pets.

## 4. Run the frontend
Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually `http://localhost:5173`.

## 5. Create roles for testing
Register users from the UI. Public registration always creates an ADOPTER account.

To promote a user, first register and then run (replace the email):
```sql
USE pawhaven_db;
UPDATE users SET role = 'SHELTER' WHERE email = 'shelter@example.com';
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```
Log out and log back in after changing a role so the new JWT contains the updated role.

## Main API endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Pets
- `GET /api/pets?page=0&size=9&sortBy=name&direction=asc` — public, paginated and sorted
- `GET /api/pets/{id}` — public
- `POST /api/pets` — SHELTER or ADMIN
- `PUT /api/pets/{id}` — SHELTER or ADMIN
- `DELETE /api/pets/{id}` — SHELTER or ADMIN

### Adoption requests
- `POST /api/adoptions` — ADOPTER
- `GET /api/adoptions/my` — ADOPTER
- `GET /api/adoptions` — SHELTER or ADMIN
- `PATCH /api/adoptions/{id}/status` — SHELTER or ADMIN

### Example request bodies
Register:
```json
{
  "name": "Asha Adopter",
  "email": "asha@example.com",
  "password": "Password123!"
}
```

Login:
```json
{
  "email": "asha@example.com",
  "password": "Password123!"
}
```

Create a pet (send `Authorization: Bearer <token>`):
```json
{
  "name": "Milo",
  "species": "Dog",
  "breed": "Indie",
  "age": 2,
  "gender": "Male",
  "description": "Friendly, playful, and vaccinated.",
  "imageUrl": "",
  "status": "AVAILABLE"
}
```

Submit an adoption request (ADOPTER token):
```json
{
  "petId": 1,
  "message": "I have a safe home and time to care for this pet."
}
```

Update adoption status:
```json
{
  "status": "APPROVED"
}
```
Valid statuses: `PENDING`, `APPROVED`, `REJECTED`.

## Troubleshooting
- **MySQL access denied:** verify `DB_USERNAME` and `DB_PASSWORD`.
- **Port 8080 in use:** stop the other service or change `server.port`.
- **Frontend API errors:** start the backend first and check browser DevTools.
- **Maven not found:** install Maven, or open/import the `backend` directory in IntelliJ IDEA/Eclipse.
- **CORS:** Vite's `http://localhost:5173` origin is allowed in the backend config.

## Project structure
```text
PawHaven/
├── frontend/                  # React user interface
├── backend/                   # Spring Boot REST API
└── README.md
```

This is an educational starter project. Before real-world use, add production-grade secret management, email verification, audit logging, image upload storage, rate limiting, and a formal privacy/security review.
