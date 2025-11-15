"""
Migration 005: Add is_easy_access column to prompts table

This migration adds the is_easy_access column to support easy access floating toolbar feature.
Users can mark up to 8 prompts as easy access for quick copy functionality.
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

    print(f"[MIGRATION 005] Adding is_easy_access column to prompts table")
    print(f"[MIGRATION 005] Database: {db_path}")

    # Check if database exists
    if not Path(db_path).exists():
        print(f"[MIGRATION 005] Database does not exist yet - will be created with schema")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(prompts)")
        columns = [row[1] for row in cursor.fetchall()]

        if 'is_easy_access' in columns:
            print(f"[MIGRATION 005] Column 'is_easy_access' already exists - skipping")
            return

        # Add the column
        print(f"[MIGRATION 005] Adding is_easy_access column...")
        cursor.execute("""
            ALTER TABLE prompts
            ADD COLUMN is_easy_access BOOLEAN DEFAULT 0
        """)

        # Create index on is_easy_access for faster filtering
        print(f"[MIGRATION 005] Creating index on is_easy_access...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_prompts_easy_access
            ON prompts(is_easy_access)
        """)

        conn.commit()
        print(f"[MIGRATION 005] Migration completed successfully")

    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION 005] Migration failed: {e}")
        raise
    finally:
        conn.close()


def rollback():
    """Rollback the migration (SQLite doesn't support DROP COLUMN easily)."""
    print(f"[MIGRATION 005] Rollback not supported for SQLite ALTER TABLE ADD COLUMN")
    print(f"[MIGRATION 005] To rollback, restore database from backup")


if __name__ == "__main__":
    migrate()
