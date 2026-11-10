from fastapi import FastAPI

app = FastAPI(
    title="Trialshopy AI Smart Student Mentor",
    description="AI-powered academic and career mentoring platform",
    version="1.0.0"
)

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
