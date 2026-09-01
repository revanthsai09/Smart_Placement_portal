# PlacementHub — Full-Stack Campus Placement Portal

A production-ready Java full-stack placement portal built with **Spring Boot** (backend) and **React** (frontend).

---

## Features

### Core Authentication
- Register/Login for Students, Recruiters (Admin seeded via SQL)
- JWT-based stateless authentication
- Role-based access control (STUDENT / RECRUITER / ADMIN)

### Student Features
- Profile management (name, college, branch, year, CGPA, skills)
- Resume upload (PDF, stored on server)
- Browse all active jobs with keyword + location search
- One-click apply to jobs
- Track all applications with real-time status (Applied / Shortlisted / Rejected / Hired)

### Recruiter Features
- Post, edit, and delete job listings
- View applicants per job with full student profiles
- Shortlist, Reject, or Mark Hired per application

### Admin Features
- Dashboard with platform-wide statistics
- View all students and recruiters
- Block / unblock users
- Delete inappropriate job listings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.2, Spring Security 6, Spring Data JPA |
| Database | MySQL 8 |
| Auth | JWT (jjwt 0.12.3) |
| Frontend | React 18 (Create React App), React Router v6, Axios |
| Styling | Vanilla CSS (dark glassmorphism) |
| Deployment | Railway (backend + MySQL) / Vercel (frontend) |

---

## Project Structure

```
placement-portal/
├── backend/          # Spring Boot Maven project
└── frontend/         # Create React App project
```

---

## Local Development Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8 running locally
- Node.js 18+

### 1. Database Setup
```sql
CREATE DATABASE placement_portal;
```

### 2. Backend Setup
```bash
cd backend

# Update src/main/resources/application.properties if needed:
# spring.datasource.username=root
# spring.datasource.password=YOUR_MYSQL_PASSWORD

mvn clean install
mvn spring-boot:run
```

Backend runs on: http://localhost:8080

> **Admin Account** (seeded automatically on first run):
> - Email: `admin@portal.com`
> - Password: `admin123`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000 (proxied to backend at :8080)

---

## Deployment

### Backend → Railway

1. Push the `backend/` folder to a GitHub repo
2. Go to [Railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a **MySQL** plugin to the project
4. Set environment variables:

| Variable | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:<port>/railway?serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | `root` (from Railway MySQL plugin) |
| `SPRING_DATASOURCE_PASSWORD` | `<from Railway MySQL plugin>` |
| `JWT_SECRET` | Any long random string (32+ chars) |
| `PORT` | `8080` |

5. Railway detects `pom.xml` and builds/runs the JAR automatically.

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repo
2. Go to [Vercel.com](https://vercel.com) → New Project → Import GitHub repo
3. Set environment variable:

| Variable | Value |
|---|---|
| `REACT_APP_API_BASE_URL` | `https://<your-railway-backend-url>` |

4. Vercel runs `npm run build` and deploys the `build/` folder.

> **Important:** After deploying, update the backend's CORS config if needed. Currently it allows all origins (`*`).

---

## API Reference

### Auth
```
POST /api/auth/register   { name, email, password, role: STUDENT|RECRUITER }
POST /api/auth/login      { email, password }
```

### Student (requires JWT + STUDENT role)
```
GET    /api/student/profile
PUT    /api/student/profile
POST   /api/student/profile/resume   (multipart/form-data)
GET    /api/jobs?keyword=&location=
POST   /api/applications/{jobId}
GET    /api/applications/my
```

### Recruiter (requires JWT + RECRUITER role)
```
GET    /api/jobs/my
POST   /api/jobs
PUT    /api/jobs/{id}
DELETE /api/jobs/{id}
GET    /api/applications/job/{jobId}
PUT    /api/applications/{id}/status  { status: SHORTLISTED|REJECTED|HIRED }
```

### Admin (requires JWT + ADMIN role)
```
GET    /api/admin/dashboard
GET    /api/admin/users
PUT    /api/admin/users/{id}/toggle-active
DELETE /api/admin/jobs/{id}
```

---

## Environment Variables Summary

### Backend (application.properties / Railway env)
```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/placement_portal?createDatabaseIfNotExist=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
JWT_SECRET=PlacementPortalSuperSecretKey2024ForJWTAuthenticationHS256Algorithm
PORT=8080
```

### Frontend (.env / Vercel env)
```env
REACT_APP_API_BASE_URL=http://localhost:8080
```
(Leave empty for local dev since CRA proxy handles it)

---

## Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
# JAR is at: target/placement-portal-0.0.1-SNAPSHOT.jar
java -jar target/placement-portal-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Static files are at: build/
# Serve with: npx serve -s build
```

---

## Database Entities

- **users** — id, name, email, password, role, is_active, created_at
- **student_profiles** — id, user_id, college, branch, year, cgpa, skills, resume_url
- **jobs** — id, recruiter_id, title, description, required_skills, salary, location, deadline, is_active, created_at
- **applications** — id, student_id, job_id, status, applied_at

Tables are auto-created by Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

---

## License
MIT
