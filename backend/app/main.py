from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze, tryon

app = FastAPI(
    title="Color Palette Analyzer API",
    description="Analyze selfies to extract colors and determine seasonal color palettes",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(tryon.router, prefix="/api", tags=["tryon"])


@app.get("/")
async def root():
    return {"message": "Color Palette Analyzer API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
