# BillWise — Usage Metering & Billing Platform

A full-stack billing platform built to track API usage, manage subscription plans, and generate invoices. BillWise provides a centralized dashboard for monitoring usage and managing subscription-based billing.

**Live Demo:** [BillWise](https://bill-wise-ten.vercel.app/)

**Backend API:** [BillWise API](https://billwise-api-t5ng.onrender.com/)

**API Documentation:** [Swagger UI](https://billwise-api-t5ng.onrender.com/docs)

---

## Features

- **Authentication** — User registration and login.
- **Plan Management** — Create and view subscription plans.
- **Subscription Management** — Manage subscriptions associated with users and plans.
- **Usage Metering** — Record and track usage events.
- **Invoice Generation** — Generate invoices based on subscription usage and billing periods.
- **Billing History** — View generated invoices and their billing periods.
- **Interactive Dashboard** — Access billing and usage information through a React-based interface.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL (Neon) |
| ORM | SQLAlchemy |
| Database Migrations | Alembic |
| Authentication | JWT-based authentication |
| Deployment | Vercel, Render |
| API Documentation | OpenAPI, Swagger UI |

## Architecture

```text
                  ┌──────────────────────┐
                  │   React + Vite UI    │
                  │       Vercel         │
                  └──────────┬───────────┘
                             │ HTTP Requests
                             ▼
                  ┌──────────────────────┐
                  │    FastAPI Backend   │
                  │       Render         │
                  └──────────┬───────────┘
                             │ SQLAlchemy
                             ▼
                  ┌──────────────────────┐
                  │ PostgreSQL Database  │
                  │        Neon          │
                  └──────────────────────┘
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js and npm
- PostgreSQL database
- Git

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd BillWise
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual GitHub repository URL.

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=your_postgresql_connection_url
SECRET_KEY=your_secure_secret_key
```

Use your own PostgreSQL connection URL and a securely generated secret key. Never commit your `.env` file.

Run database migrations:

```bash
alembic upgrade head
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Ensure the frontend API client reads this variable when constructing backend requests.

Start the frontend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |
| `SECRET_KEY` | Secret used for signing authentication tokens |
| `VITE_API_URL` | Base URL of the FastAPI backend |

For production, configure environment variables through the respective hosting dashboards rather than committing credentials to GitHub.

## Deployment

- **Frontend:** [Vercel](https://bill-wise-ten.vercel.app/)
- **Backend:** [Render](https://billwise-api-t5ng.onrender.com/)
- **API Docs:** [Swagger UI](https://billwise-api-t5ng.onrender.com/docs)
- **Database:** PostgreSQL hosted on Neon

The backend must allow requests from the deployed frontend origin through its CORS configuration. Set `VITE_API_URL` in Vercel to the deployed backend URL and redeploy the frontend after changing build-time environment variables.

## Future Improvements

- Automated billing and invoice scheduling
- Detailed usage analytics and reporting
- Automated tests for billing calculations and API endpoints
- Improved invoice exports and notifications

---

**Built with FastAPI, React, and PostgreSQL.**
