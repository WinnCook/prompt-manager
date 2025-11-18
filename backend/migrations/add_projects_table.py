"""
Migration 007: Add projects table

This migration creates the projects table to support the Project Quick Copy feature.
Projects store title and file_location for rapid context-aware prompt generation.
"""
import sqlite3
from pathlib import Path


def get_db_path():
    """Get the database file path."""
    # Database is in backend directory (same as when app runs)
    db_path = Path(__file__).parent.parent / "prompts.db"
    return str(db_path)


def migrate():
    """Run the migration."""
    db_path = get_db_path()

    print(f"[MIGRATION 007] Creating projects table")
    print(f"[MIGRATION 007] Database: {db_path}")

    # Check if database exists
    if not Path(db_path).exists():
        print(f"[MIGRATION 007] Database does not exist yet - will be created with schema")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if table already exists
        cursor.execute("""
            SELECT name FROM sqlite_master
            WHERE type='table' AND name='projects'
        """)

        if cursor.fetchone():
            print(f"[MIGRATION 007] Table 'projects' already exists - skipping")
            return

        # Create projects table
        print(f"[MIGRATION 007] Creating projects table...")
        cursor.execute("""
            CREATE TABLE projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                file_location TEXT NOT NULL,
                display_order INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create index on display_order for efficient sorting
        print(f"[MIGRATION 007] Creating index on display_order...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_projects_display_order
            ON projects(display_order)
        """)

        # Create trigger for updated_at timestamp
        print(f"[MIGRATION 007] Creating updated_at trigger...")
        cursor.execute("""
            CREATE TRIGGER IF NOT EXISTS update_projects_timestamp
            AFTER UPDATE ON projects
            FOR EACH ROW
            BEGIN
                UPDATE projects SET updated_at = CURRENT_TIMESTAMP
                WHERE id = OLD.id;
            END
        """)

        conn.commit()
        print(f"[MIGRATION 007] Migration completed successfully")
        print(f"[MIGRATION 007] Projects table created with columns: id, title, file_location, display_order, created_at, updated_at")

    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION 007] Migration failed: {e}")
        raise
    finally:
        conn.close()


def rollback():
    """Rollback the migration."""
    db_path = get_db_path()

    print(f"[MIGRATION 007] Rolling back - dropping projects table")
    print(f"[MIGRATION 007] Database: {db_path}")

    if not Path(db_path).exists():
        print(f"[MIGRATION 007] Database does not exist - nothing to rollback")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute("DROP TABLE IF EXISTS projects")
        cursor.execute("DROP INDEX IF EXISTS idx_projects_display_order")
        cursor.execute("DROP TRIGGER IF EXISTS update_projects_timestamp")
        conn.commit()
        print(f"[MIGRATION 007] Rollback completed successfully")
    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION 007] Rollback failed: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()
