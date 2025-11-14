"""
Migration 003: Add display_order column to prompts table

This migration adds the display_order column to support user-defined sorting
of prompts within folders. Existing prompts will have NULL display_order,
which will be auto-assigned on first reorder operation.
"""
import sqlite3
from pathlib import Path


def get_db_path():
    """Get the database file path."""
    # Database is in the project root by default
    db_path = Path(__file__).parent.parent.parent / "prompts.db"
    return str(db_path)


def migrate():
    """Run the migration."""
    db_path = get_db_path()

    print(f"[MIGRATION 003] Adding display_order column to prompts table")
    print(f"[MIGRATION 003] Database: {db_path}")

    # Check if database exists
    if not Path(db_path).exists():
        print(f"[MIGRATION 003] Database does not exist yet - will be created with schema")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(prompts)")
        columns = [row[1] for row in cursor.fetchall()]

        if 'display_order' in columns:
            print(f"[MIGRATION 003] Column 'display_order' already exists - skipping")
            return

        # Add the column
        print(f"[MIGRATION 003] Adding display_order column...")
        cursor.execute("""
            ALTER TABLE prompts
            ADD COLUMN display_order INTEGER
        """)

        # Create index on display_order for faster sorting
        print(f"[MIGRATION 003] Creating index on display_order...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_prompts_display_order
            ON prompts(display_order)
        """)

        # Optional: Auto-assign display_order to existing prompts per folder
        print(f"[MIGRATION 003] Auto-assigning display_order to existing prompts...")
        cursor.execute("""
            SELECT id, folder_id
            FROM prompts
            ORDER BY folder_id, created_at ASC
        """)
        prompts = cursor.fetchall()

        # Group by folder and assign sequential order
        folder_orders = {}
        for prompt_id, folder_id in prompts:
            if folder_id not in folder_orders:
                folder_orders[folder_id] = 1

            cursor.execute("""
                UPDATE prompts
                SET display_order = ?
                WHERE id = ?
            """, (folder_orders[folder_id], prompt_id))

            folder_orders[folder_id] += 1

        conn.commit()
        print(f"[MIGRATION 003] ✓ Migration completed successfully")
        print(f"[MIGRATION 003] ✓ Assigned display_order to {len(prompts)} existing prompts")

    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION 003] ✗ Migration failed: {e}")
        raise
    finally:
        conn.close()


def rollback():
    """Rollback the migration (SQLite doesn't support DROP COLUMN easily)."""
    print(f"[MIGRATION 003] Rollback not supported for SQLite ALTER TABLE ADD COLUMN")
    print(f"[MIGRATION 003] To rollback, restore database from backup")


if __name__ == "__main__":
    migrate()
