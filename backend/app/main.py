from fastapi import FastAPI, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from .config import settings
from .logging_config import setup_logging
from .errors import register_error_handlers
from .database import get_db, engine, Base
from .routers import auth
import app.models # Ensure all models are registered in Base metadata

# Initialize logging before creating the app
setup_logging()

# Auto-create tables on startup (especially helpful for local testing/SQLite fallback)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Pradeepa Info Tech (Computer Academy & E-Commerce Store & POS)",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom error exception handlers
register_error_handlers(app)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "api_version": "1.0.0",
        "supported_locales": ["en", "ta"],
        "message": "Welcome to Pradeepa Info Tech backend API!"
    }

@app.get("/health", tags=["Health Check"])
def health_check(db: Session = Depends(get_db)):
    try:
        # Run a simple SELECT 1 query to confirm DB connectivity
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": f"disconnected: {str(e)}"
            }
        )
