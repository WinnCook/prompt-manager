"""
Database configuration and session management.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},  # Needed for SQLite
    echo=settings.DEBUG,
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for getting database session.

    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database - create all tables and run migrations."""
    from app.db.models import Folder, Prompt, Version, ClaudeJob

    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Run migrations
    try:
        from migrations import migration_003_add_display_order
        migration_003_add_display_order.migrate()
    except Exception as e:
        print(f"[WARNING] Migration failed: {e}")

    # Create root folder if it doesn't exist
    db = SessionLocal()
    try:
        root_folder = db.query(Folder).filter(Folder.parent_id.is_(None)).first()
        if not root_folder:
            root = Folder(
                name="Root",
                parent_id=None,
                path="/"
            )
            db.add(root)
            db.commit()
            print("[OK] Database initialized with root folder")
    finally:
        db.close()
