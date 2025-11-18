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
    from app.db.models import Folder, Prompt, Version, ClaudeJob, Project

    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Run migrations FIRST before any queries
    try:
        from migrations import add_display_order
        from migrations import add_folder_display_order
        from migrations import add_easy_access_order
        from migrations import add_projects_table
        add_display_order.migrate()
        add_folder_display_order.migrate()
        add_easy_access_order.migrate()
        add_projects_table.migrate()
        print("[OK] Migrations completed successfully")
    except Exception as e:
        print(f"[WARNING] Migration failed: {e}")

    # Create root folder if it doesn't exist (AFTER migrations)
    db = SessionLocal()
    try:
        # Now safe to query - migrations have run
        root_folder = db.query(Folder).filter(Folder.parent_id.is_(None)).first()
        if not root_folder:
            root = Folder(
                name="Root",
                parent_id=None,
                path="/",
                display_order=0
            )
            db.add(root)
            db.commit()
            print("[OK] Database initialized with root folder")
    finally:
        db.close()
