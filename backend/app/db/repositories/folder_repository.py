"""
Folder repository - data access layer for folders.
"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.models import Folder


class FolderRepository:
    """Repository for folder database operations."""

    def __init__(self, db: Session):
        """
        Initialize repository with database session.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def get_all(self) -> List[Folder]:
        """
        Get all folders.

        Returns:
            List of all folders
        """
        return self.db.query(Folder).all()

    def get_by_id(self, folder_id: int) -> Optional[Folder]:
        """
        Get folder by ID.

        Args:
            folder_id: Folder ID

        Returns:
            Folder object or None if not found
        """
        return self.db.query(Folder).filter(Folder.id == folder_id).first()

    def get_by_parent_id(self, parent_id: Optional[int]) -> List[Folder]:
        """
        Get folders by parent ID.

        Args:
            parent_id: Parent folder ID (None for root folders)

        Returns:
            List of folders
        """
        if parent_id is None:
            return self.db.query(Folder).filter(Folder.parent_id.is_(None)).all()
        return self.db.query(Folder).filter(Folder.parent_id == parent_id).all()

    def create(self, folder: Folder) -> Folder:
        """
        Create a new folder.

        Args:
            folder: Folder object to create

        Returns:
            Created folder
        """
        self.db.add(folder)
        self.db.commit()
        self.db.refresh(folder)
        return folder

    def update(self, folder: Folder) -> Folder:
        """
        Update an existing folder.

        Args:
            folder: Folder object with updates

        Returns:
            Updated folder
        """
        self.db.commit()
        self.db.refresh(folder)
        return folder

    def delete(self, folder: Folder) -> None:
        """
        Delete a folder.

        Args:
            folder: Folder object to delete
        """
        self.db.delete(folder)
        self.db.commit()

    def exists_by_name_and_parent(self, name: str, parent_id: Optional[int]) -> bool:
        """
        Check if a folder with the given name exists under the parent.

        Args:
            name: Folder name
            parent_id: Parent folder ID

        Returns:
            True if exists, False otherwise
        """
        query = self.db.query(Folder).filter(Folder.name == name)
        if parent_id is None:
            query = query.filter(Folder.parent_id.is_(None))
        else:
            query = query.filter(Folder.parent_id == parent_id)
        return query.first() is not None

    def get_by_name_and_parent(self, name: str, parent_id: Optional[int]) -> Optional[Folder]:
        """
        Get a folder by name and parent.

        Args:
            name: Folder name
            parent_id: Parent folder ID

        Returns:
            Folder if found, None otherwise
        """
        query = self.db.query(Folder).filter(Folder.name == name)
        if parent_id is None:
            query = query.filter(Folder.parent_id.is_(None))
        else:
            query = query.filter(Folder.parent_id == parent_id)
        return query.first()
