from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import user,admin
# from .database import engine, Base

# Create database tables
# Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",  # Sometimes browsers resolve this way
]



app = FastAPI(
    title="FastAPI Boilerplate",
    description="A modular FastAPI project structure",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods
    allow_headers=["*"],              # Allow all headers
)

# Include routers
app.include_router(user.router)
app.include_router(admin.router_admin)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI Boilerplate"}
