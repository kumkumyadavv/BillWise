from fastapi import FastAPI
app=FastAPI(title="BillWise")

@app.get("/")
def get_root():
        return {"message":"API is running"}

@app.get("/health")
def check_health():
        return {"health":"Api good"}