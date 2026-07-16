import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

logger = logging.getLogger("app")

# Base class for SQLAlchemy models
Base = declarative_base()

try:
    # Attempt to initialize MySQL database engine
    if "sqlite" in settings.DATABASE_URL:
        # If user explicitly configured SQLite in env
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False}
        )
        logger.info("Connected to SQLite database.")
    else:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20
        )
        # Test connection immediately
        with engine.connect() as conn:
            pass
        logger.info("Connected to MySQL database successfully.")
except Exception as e:
    # Fallback to local SQLite instance if MySQL is not reachable
    logger.warning(
        f"MySQL database connection failed: {e}. "
        "Falling back to local SQLite database (local_pradeepa.db) for local testing."
    )
    sqlite_url = "sqlite:///./local_pradeepa.db"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False}
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# FastAPI dependency to yield database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
