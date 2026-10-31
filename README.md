# StaffSync — Modern Human Resource Management Solution

StaffSync is a MERN-based HR workspace for employee records, attendance, leave workflows, payroll records, and announcements. It provides separate entry points for administrators, HR staff, and employees.

> **Attribution:** This repository is a customized fork of [MERNForge/HRMS](https://github.com/MERNForge/HRMS). The original project and its authors retain credit for the upstream work. The upstream README identifies the project as MIT licensed; see the source repository for its original notices. This fork adds StaffSync branding, an improved role-selection page, and project-specific setup documentation.

## Project links

- **GitHub:** [aachikashukla06/StaffSync](https://github.com/aachikashukla06/StaffSync)
- **StaffSync live demo:** Not deployed yet.
- **Upstream reference demo:** [hrms-sand-chi.vercel.app](https://hrms-sand-chi.vercel.app/) — this is the original project's demo, not a deployment of this fork.

## Current workflows

- **Administrator:** manage accounts and departments, oversee payroll records, and view workforce information.
- **HR:** manage employee profiles, attendance, and leave approvals.
- **Employee:** check attendance, submit leave requests, and review profile and payroll information.
- **Announcements:** publish and review organization updates.

## Tech stack

React 18, Vite, JavaScript, Node.js, Express, MongoDB/Mongoose, and JWT authentication.

## Run locally

Requirements: Node.js 20 or newer, npm, and a MongoDB Atlas cluster or local MongoDB server.

Clone your fork:

~~~powershell
git clone https://github.com/aachikashukla06/StaffSync.git
cd StaffSync
~~~

Install backend dependencies, create your local environment file, and start the API:

~~~powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
~~~

Edit backend/.env with your MongoDB connection string and a private JWT key before starting the server. Open a second terminal at the project root to start the frontend:

~~~powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
~~~

Vite prints the local frontend URL (normally http://localhost:5173). The API runs on port 5000 by default. Keep both terminals open while using the app.

## Environment variables

backend/.env.example documents the backend settings. Keep the real .env file private; it is ignored by Git.

- MONGO_URI: Atlas or local MongoDB connection string.
- JWT_SECRET_KEY: a long, private random value used to sign access tokens.
- PORT: API port; defaults to 5000.
- ADMIN_LOGIN_ID, ADMIN_EMAIL, ADMIN_PASSWORD: first-run admin account settings. Set these before the first backend start so the seeded password is yours.

frontend/.env.example contains VITE_API_BASE_URL, which points the frontend to the local API.

The server creates the initial admin account only when the database has no admin. Set your own ADMIN_PASSWORD before first start; do not deploy the sample defaults.

## API routes

The backend exposes role-protected routes under /api/v1, including authentication, departments, employees, leaves, attendance, payroll, and announcements.

## Credit and license

StaffSync retains the source project's identity as a fork and links back to [MERNForge/HRMS](https://github.com/MERNForge/HRMS). The upstream README states that the project is MIT licensed. Preserve the original attribution and notices when redistributing.
