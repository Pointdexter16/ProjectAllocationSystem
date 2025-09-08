from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import login
# from .database import engine, Base

# Create database tables
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI Boilerplate",
    description="A modular FastAPI project structure",
    version="1.0.0"
)

# Include routers
# app.include_router(items.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI Boilerplate"}
