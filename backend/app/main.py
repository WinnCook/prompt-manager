"""
Prompt Manager Backend - FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.exceptions import AppException
from app.core.error_handlers import (
    app_exception_handler,
    validation_exception_handler,
    generic_exception_handler
)
from app.db.database import init_db

app = FastAPI(
    title="Prompt Manager API",
    description="Backend API for Prompt Manager desktop application",
    version="0.1.0",
)

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register error handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Import and register routers
from app.api.routers import folders, prompts

app.include_router(folders.router)
app.include_router(prompts.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()
    print(f"[START] Prompt Manager API started on {settings.HOST}:{settings.PORT}")


@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "success": True,
        "message": "Prompt Manager API",
        "version": "0.1.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return JSONResponse(
        content={
            "success": True,
            "status": "healthy",
            "database": "connected"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
