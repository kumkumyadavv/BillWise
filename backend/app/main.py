from fastapi import FastAPI
app=FastAPI(title="BillWise")

from app.auth.routes import router as auth_router

app.include_router(auth_router)

@app.get("/")
def get_root():
        return {"message":"API is running"}

@app.get("/health")
def check_health():
        return {"health":"Api good"}