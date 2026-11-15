import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.admin import router as admin_router
from app.api.v1.super_admin import router as super_admin_router


app = FastAPI(
    title="Trialshopy AI Smart Student Mentor",
    description="AI-powered academic and career mentoring platform",
    version="1.0.0"
)

# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

# Read origins from environment variable
# Defaults to localhost for development
frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in frontend_origins
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# ROUTERS
# --------------------------------------------------

app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(super_admin_router, prefix="/api/v1")


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": "Welcome to Trialshopy AI Smart Student Mentor",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "application": "Trialshopy AI Mentor"
    }