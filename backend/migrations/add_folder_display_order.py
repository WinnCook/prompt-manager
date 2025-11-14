"""
Migration 004: Add display_order column to folders table

This migration adds the display_order column to support user-defined sorting
of folders within their parent folder.
"""
import sqlite3
from pathlib import Path


def get_db_path():
    """Get the database file path."""
    db_path = Path(__file__).parent.parent.parent / "prompts.db"
    return str(db_path)


def migrate():
    """Run the migration."""
    db_path = get_db_path()

    print(f"[MIGRATION 004] Adding display_order column to folders table")
    print(f"[MIGRATION 004] Database: {db_path}")

    # Check if database exists
    if not Path(db_path).exists():
        print(f"[MIGRATION 004] Database does not exist yet - will be created with schema")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(folders)")
        columns = [row[1] for row in cursor.fetchall()]

        if 'display_order' in columns:
            print(f"[MIGRATION 004] Column 'display_order' already exists - skipping")
            return

        # Add the column
        print(f"[MIGRATION 004] Adding display_order column...")
        cursor.execute("""
            ALTER TABLE folders
            ADD COLUMN display_order INTEGER
        """)

        # Create index on display_order for faster sorting
        print(f"[MIGRATION 004] Creating index on display_order...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_folders_display_order
            ON folders(display_order)
        """)

        # Auto-assign display_order to existing folders per parent
        print(f"[MIGRATION 004] Auto-assigning display_order to existing folders...")
        cursor.execute("""
            SELECT id, parent_id
            FROM folders
            ORDER BY parent_id, created_at ASC
        """)
        folders = cursor.fetchall()

        # Group by parent and assign sequential order
        parent_orders = {}
        for folder_id, parent_id in folders:
            parent_key = parent_id if parent_id is not None else 'root'
            if parent_key not in parent_orders:
                parent_orders[parent_key] = 1

            cursor.execute("""
                UPDATE folders
                SET display_order = ?
                WHERE id = ?
            """, (parent_orders[parent_key], folder_id))

            parent_orders[parent_key] += 1

        conn.commit()
        print(f"[MIGRATION 004] ✓ Migration completed successfully")
        print(f"[MIGRATION 004] ✓ Assigned display_order to {len(folders)} existing folders")

    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION 004] ✗ Migration failed: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()
