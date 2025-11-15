"""
Migration 006: Add easy_access_order column to prompts table

This migration adds the easy_access_order column to support user-defined sorting
of easy access prompts. Existing easy access prompts will be auto-assigned sequential
order based on their title (alphabetical).
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

    print(f"[MIGRATION 006] Adding easy_access_order column to prompts table")
    print(f"[MIGRATION 006] Database: {db_path}")

    # Check if database exists
    if not Path(db_path).exists():
        print(f"[MIGRATION 006] Database does not exist yet - will be created with schema")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(prompts)")
        columns = [row[1] for row in cursor.fetchall()]

        if 'easy_access_order' in columns:
            print(f"[MIGRATION 006] Column 'easy_access_order' already exists - skipping")
            return

        # Add the column
        print(f"[MIGRATION 006] Adding easy_access_order column...")
        cursor.execute("""
            ALTER TABLE prompts
            ADD COLUMN easy_access_order INTEGER
        """)

        # Create index on easy_access_order for faster sorting
        print(f"[MIGRATION 006] Creating index on easy_access_order...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_prompts_easy_access_order
            ON prompts(easy_access_order)
        """)

        # Auto-assign easy_access_order to existing easy access prompts
        print(f"[MIGRATION 006] Auto-assigning easy_access_order to existing easy access prompts...")
        cursor.execute("""
            SELECT id
            FROM prompts
            WHERE is_easy_access = 1
            ORDER BY title ASC
        """)
        prompts = cursor.fetchall()

        # Assign sequential order
        for idx, (prompt_id,) in enumerate(prompts, start=1):
            cursor.execute("""
                UPDATE prompts
                SET easy_access_order = ?
                WHERE id = ?
            """, (idx, prompt_id))

        conn.commit()
        print(f"[MIGRATION 006] Migration completed successfully")
        print(f"[MIGRATION 006] Assigned easy_access_order to {len(prompts)} existing easy access prompts")

    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION 006] Migration failed: {e}")
        raise
    finally:
        conn.close()


def rollback():
    """Rollback the migration (SQLite doesn't support DROP COLUMN easily)."""
    print(f"[MIGRATION 006] Rollback not supported for SQLite ALTER TABLE ADD COLUMN")
    print(f"[MIGRATION 006] To rollback, restore database from backup")


if __name__ == "__main__":
    migrate()
