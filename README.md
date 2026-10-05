# Billwise

> **Track usage. Calculate charges. Bill accurately.**

Billwise is a backend-focused **usage metering and billing engine for SaaS applications**.

It tracks customer usage, applies configurable pricing rules, calculates usage-based charges, and generates invoices for each billing cycle.

The project is designed to explore the backend concepts behind real-world SaaS billing systems — beyond basic CRUD APIs.

---

## 🚀 What is Billwise?

Many SaaS products charge customers based on a combination of:

* A recurring subscription
* Included usage
* Additional usage
* Different pricing rules

For example:

```text
Pro Plan
₹499 / month

10,000 API requests included
₹0.02 per additional request
```

If a customer uses **12,500 requests** during the billing cycle:

```text
Included usage     10,000
Actual usage       12,500
Overage             2,500

Overage charge = 2,500 × ₹0.02
               = ₹50

Final bill = ₹499 + ₹50
           = ₹549
```

Billwise handles this process automatically.

---

## 🎯 Core Workflow

```text
                  ┌──────────────┐
                  │    Customer  │
                  └──────┬───────┘
                         │
                         ▼
                  Select a Plan
                         │
                         ▼
                  Generate Usage
                         │
                         ▼
                ┌─────────────────┐
                │ Usage Metering  │
                └────────┬────────┘
                         │
                         ▼
                 Usage Aggregation
                         │
                         ▼
                ┌─────────────────┐
                │ Billing Engine  │
                └────────┬────────┘
                         │
                         ▼
                 Pricing Rules
                         │
                         ▼
                   Final Charges
                         │
                         ▼
                    Invoice
```

---

## ✨ Planned Features

### Authentication

* User registration and login
* Password hashing
* JWT-based authentication
* Protected API routes

### Plans & Subscriptions

* Create and manage pricing plans
* Define included usage
* Configure overage pricing
* Subscribe customers to plans
* Track subscription status and billing periods

### Usage Metering

* Record usage events
* Support multiple usage metrics
* Aggregate usage by billing period
* Track customer-level consumption
* Prevent duplicate usage events through idempotency

### Billing Engine

* Calculate base subscription charges
* Calculate usage-based charges
* Apply overage pricing
* Handle multiple billing metrics
* Generate accurate billing totals

### Invoices

* Generate invoices from billing data
* Break invoices into individual line items
* Track invoice status
* Maintain invoice history

### Dashboard

Customers will be able to view:

* Current subscription
* Usage
* Usage limits
* Current charges
* Previous invoices

Admins will be able to manage:

* Pricing plans
* Customers
* Usage
* Subscriptions
* Invoices

---

## 🧠 Backend Concepts Explored

Billwise is intentionally designed to go beyond basic CRUD.

The project explores:

* REST API design
* Request validation
* Authentication & authorization
* JWT
* Role-based access control
* Relational database design
* Foreign keys and relationships
* Database constraints
* SQL aggregation
* Transactions
* Business logic separation
* Service-layer architecture
* Idempotency
* Billing cycles
* Usage aggregation
* Financial calculations
* Error handling
* Pagination and filtering
* Automated API testing

---

## 🏗️ Architecture

Billwise follows a layered backend architecture:

```text
Client
  │
  ▼
FastAPI Routes
  │
  ▼
Validation / Dependencies
  │
  ▼
Service Layer
  │
  ├── Authentication
  ├── Usage Service
  ├── Billing Service
  └── Invoice Service
  │
  ▼
SQLAlchemy
  │
  ▼
PostgreSQL
```

The goal is to keep:

```text
API Layer
    ≠
Business Logic
    ≠
Database Layer
```

This makes the application easier to test, maintain, and extend.

---

## 🗄️ Core Data Model

The initial database design contains:

```text
User
 │
 ├──────────────► Subscription
 │                       │
 │                       ▼
 │                      Plan
 │
 ├──────────────► Usage Events
 │
 └──────────────► Invoices
                         │
                         ▼
                    Invoice Items
```

### User

Stores customer and admin accounts.

```text
id
name
email
password_hash
role
created_at
```

### Plan

Defines pricing rules.

```text
id
name
monthly_price
included_requests
request_overage_price
included_storage
storage_overage_price
```

### Subscription

Connects a customer to a plan.

```text
id
user_id
plan_id
status
start_date
current_period_start
current_period_end
```

### Usage Event

Stores individual usage events.

```text
id
event_id
user_id
metric
quantity
created_at
```

`event_id` is unique to support idempotent event processing.

### Invoice

Represents a customer's bill.

```text
id
user_id
billing_period_start
billing_period_end
subtotal
total
status
created_at
```

### Invoice Item

Represents individual charges.

```text
id
invoice_id
description
quantity
unit_price
amount
```

---

## 🔐 Idempotent Usage Processing

Usage events may sometimes be sent more than once.

For example:

```text
event_123
event_123
```

Without protection, the system could incorrectly count the same usage twice.

Billwise uses a unique event identifier to ensure that an event is processed only once.

```text
event_123 → Processed ✅
event_123 → Duplicate → Ignored
```

This keeps usage and billing accurate even when requests are retried.

---

## 💰 Billing Example

Consider:

```text
Plan: Pro

Monthly subscription: ₹499

Included API requests: 10,000

Overage: ₹0.02 / request
```

Customer usage:

```text
12,500 API requests
```

Billwise calculates:

```text
Included usage     10,000
Actual usage       12,500
Overage             2,500

2,500 × ₹0.02 = ₹50
```

Final invoice:

```text
Pro subscription       ₹499
API usage overage       ₹50
----------------------------
Total                  ₹549
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy 2
* Alembic

### Database

* PostgreSQL

### Authentication

* JWT
* Password hashing

### Testing

* pytest
* HTTPX

### Deployment

* Vercel
* Render

---

## 📁 Project Structure

```text
billwise/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── tests/
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🔌 Core API Endpoints

The API will evolve as the project develops.

### Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Plans

```http
GET    /plans
GET    /plans/{id}
POST   /plans
PUT    /plans/{id}
DELETE /plans/{id}
```

### Subscriptions

```http
POST /subscriptions
GET  /subscriptions/current
POST /subscriptions/cancel
```

### Usage

```http
POST /usage/events
GET  /usage
GET  /usage/current
```

### Billing

```http
POST /billing/generate
GET  /billing/current
```

### Invoices

```http
GET /invoices
GET /invoices/{id}
```

---

## 🧪 Testing Strategy

Billwise will test both API behavior and business logic.

Important scenarios include:

### Authentication

```text
✓ User can register
✓ Duplicate email is rejected
✓ Invalid credentials are rejected
✓ Protected routes require authentication
```

### Usage

```text
✓ Usage event is recorded
✓ Invalid usage is rejected
✓ Duplicate event is not counted twice
✓ Usage is aggregated correctly
```

### Billing

```text
✓ Usage below included limit
✓ Usage exactly at included limit
✓ Usage above included limit
✓ Overage is calculated correctly
✓ Multiple metrics are billed correctly
```

Example:

```text
10,000 requests
→ ₹499

10,001 requests
→ ₹499 + overage

12,500 requests
→ ₹549
```

---

## 🔮 Future Extensions

The MVP intentionally keeps the architecture simple.

Possible future improvements:

* Redis-based usage aggregation
* Background billing jobs
* Scheduled invoice generation
* Stripe integration
* Webhook processing
* Email invoice notifications
* More advanced tiered pricing
* Usage alerts and limits
* Real-time usage dashboard
* Distributed usage ingestion

These are **not part of the initial MVP**.

---

## 🗺️ Development Roadmap

```text
[ ] Project setup
[ ] Database design
[ ] Authentication
[ ] Pricing plans
[ ] Subscriptions
[ ] Usage event ingestion
[ ] Idempotent event processing
[ ] Usage aggregation
[ ] Billing engine
[ ] Invoice generation
[ ] Customer dashboard
[ ] Admin dashboard
[ ] Automated tests
[ ] Deployment
[ ] Documentation
```

---

## 🎓 Why This Project?

Billwise is being built to understand the backend systems behind usage-based SaaS products.

Instead of building another generic CRUD application, the project focuses on:

```text
Usage
  ↓
Data
  ↓
Business Rules
  ↓
Calculation
  ↓
Billing
```


---


## 📄 License

This project is intended as a learning and portfolio project.
