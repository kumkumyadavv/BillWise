# BillWise Frontend

BillWise frontend is a React + Vite application that connects to the existing FastAPI backend in this repository.

## Prerequisites

- Node.js 18+
- npm
- A running FastAPI backend instance on the configured API URL

## Installation

```bash
cd frontend
npm install
```

## Environment configuration

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Update `VITE_API_URL` to match the backend host if needed:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Do not commit the `.env` file. The project root `.gitignore` excludes it.

## Start the frontend

```bash
cd frontend
npm run dev
```

The app runs on the default Vite local server at `http://localhost:5173`.

## Start the backend

From the repository root:

```bash
cd backend
. .venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Required backend configuration

The frontend expects the backend to allow browser requests from the local Vite origin. The FastAPI app should include CORS middleware with at least:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Implemented pages and features

- Login and registration integration with the real backend auth endpoints
- Protected dashboard, subscription, plans, usage, invoices, and account routes
- Token-based authentication using the bearer token returned by the FastAPI login endpoint
- Plan browsing and subscription creation
- Usage event submission and recent usage history
- Invoice generation and item breakdowns
- Responsive SaaS dashboard layout with dark theme styling

## Verified backend contract in this repo

The implementation uses these actual endpoints:

- `POST /auth/register` with `{ name, email, password }`
- `POST /auth/login` with `{ email, password }` returning `{ access_token, token_type }`
- `GET /plans/`
- `POST /subscriptions/` with `{ plan_id }`
- `GET /subscriptions/me`
- `POST /usage/` with `{ event_id, endpoint, quantity }`
- `GET /usage/me`
- `POST /invoices/generate`
- `GET /invoices/me`
- `GET /invoices/{invoice_id}/items`

## Current backend limitations

The frontend handles the backend limitations honestly:

- There is no current-user profile endpoint in the backend, so the app uses the stored email/name from login and registration flows rather than an API user object.
- There is no authenticated admin-only plan management API in the backend, so only plan listing and customer subscription creation are exposed.
- There is no public usage-summary endpoint; the dashboard calculates only what it can derive from the available usage and plan data.
- There is no explicit invoice detail endpoint beyond invoice items for a given invoice, which is why the UI loads line items per invoice when available.

## Production deployment

In production, set `VITE_API_URL` to the deployed FastAPI base URL, such as:

```env
VITE_API_URL=https://api.yourdomain.com
```

Do not expose secrets or database credentials in the frontend environment variables.

