from fastapi import FastAPI
app=FastAPI(title="BillWise")

from app.router.auth import router as auth_router
from app.router.plan import router as plan_router
from app.router.subscriptions import router as subscription_router
from app.router.usage import router as usage_router
from app.router.invoices import router as invoice_router
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://bill-wise-ten.vercel.app/login"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(invoice_router)
app.include_router(usage_router)
app.include_router(subscription_router)
app.include_router(auth_router)
app.include_router(plan_router)
@app.get("/")
def get_root():
        return {"message":"API is running"}

@app.get("/health")
def check_health():
        return {"health":"Api good"}