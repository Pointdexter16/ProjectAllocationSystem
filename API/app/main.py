from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import login,admin
# from .database import engine, Base

# Create database tables
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI Boilerplate",
    description="A modular FastAPI project structure",
    version="1.0.0"
)

# Include routers
app.include_router(login.router)
app.include_router(admin.router_admin)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI Boilerplate"}
