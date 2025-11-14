"""
Folder service - business logic for folder operations.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.models import Folder
from app.db.repositories.folder_repository import FolderRepository
from app.core.exceptions import (
    FolderNotFoundException,
    InvalidParentFolderException,
    DuplicateFolderNameException
)


class FolderService:
    """Service for folder business logic."""

    def __init__(self, db: Session):
        """
        Initialize service with database session.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db
        self.repo = FolderRepository(db)

    def build_folder_tree(self, folders: List[Folder]) -> List[Dict[str, Any]]:
        """
        Build hierarchical folder tree from flat list.

        Args:
            folders: List of folders

        Returns:
            Nested folder tree structure
        """
        folder_dict = {f.id: self._folder_to_dict(f) for f in folders}

        # Build tree structure
        tree = []
        for folder in folders:
            folder_data = folder_dict[folder.id]
            if folder.parent_id is None:
                tree.append(folder_data)
            elif folder.parent_id in folder_dict:
                parent = folder_dict[folder.parent_id]
                parent["children"].append(folder_data)

        return tree

    def _folder_to_dict(self, folder: Folder) -> Dict[str, Any]:
        """Convert folder to dictionary."""
        return {
            "id": folder.id,
            "name": folder.name,
            "parent_id": folder.parent_id,
            "path": folder.path,
            "created_at": folder.created_at.isoformat(),
            "updated_at": folder.updated_at.isoformat(),
            "children": []
        }

    def get_folder_tree(self) -> List[Dict[str, Any]]:
        """
        Get complete folder tree (excludes root, returns its children).

        Returns:
            Folder tree structure starting with root's children
        """
        folders = self.repo.get_all()
        tree = self.build_folder_tree(folders)

        # Find root folder and return its children instead
        # Root is the folder with parent_id = None and name = "Root"
        for folder in tree:
            if folder["parent_id"] is None and folder["name"] == "Root":
                return folder["children"]

        # If no root found, return empty list
        return []

    def get_folder_by_id(self, folder_id: int) -> Folder:
        """
        Get folder by ID.

        Args:
            folder_id: Folder ID

        Returns:
            Folder object

        Raises:
            FolderNotFoundException: If folder not found
        """
        folder = self.repo.get_by_id(folder_id)
        if not folder:
            raise FolderNotFoundException(folder_id)
        return folder

    def create_folder(self, name: str, parent_id: Optional[int] = None) -> Folder:
        """
        Create a new folder.

        Args:
            name: Folder name
            parent_id: Parent folder ID

        Returns:
            Created folder

        Raises:
            FolderNotFoundException: If parent folder not found
            DuplicateFolderNameException: If folder name already exists
        """
        # Validate parent exists
        parent = None
        if parent_id is not None:
            parent = self.get_folder_by_id(parent_id)

        # Check for duplicate name
        if self.repo.exists_by_name_and_parent(name, parent_id):
            raise DuplicateFolderNameException(name)

        # Build path
        if parent:
            path = f"{parent.path.rstrip('/')}/{name}"
        else:
            path = f"/{name}"

        # Create folder
        folder = Folder(
            name=name,
            parent_id=parent_id,
            path=path
        )
        return self.repo.create(folder)

    def update_folder(self, folder_id: int, name: str) -> Folder:
        """
        Update folder name.

        Args:
            folder_id: Folder ID
            name: New folder name

        Returns:
            Updated folder

        Raises:
            FolderNotFoundException: If folder not found
            DuplicateFolderNameException: If name already exists
        """
        folder = self.get_folder_by_id(folder_id)

        # Check for duplicate name if name changed
        if folder.name != name:
            if self.repo.exists_by_name_and_parent(name, folder.parent_id):
                raise DuplicateFolderNameException(name)

        # Update folder
        folder.name = name
        folder.updated_at = datetime.utcnow()

        # Update path for this folder and all children
        self._update_folder_paths(folder)

        return self.repo.update(folder)

    def delete_folder(self, folder_id: int) -> None:
        """
        Delete a folder (cascades to children and prompts).

        Args:
            folder_id: Folder ID

        Raises:
            FolderNotFoundException: If folder not found
            InvalidParentFolderException: If trying to delete root
        """
        folder = self.get_folder_by_id(folder_id)

        # Prevent deletion of root folder
        if folder.parent_id is None and folder.name == "Root":
            raise InvalidParentFolderException("Cannot delete root folder")

        self.repo.delete(folder)

    def move_folder(self, folder_id: int, new_parent_id: Optional[int]) -> Folder:
        """
        Move folder to a new parent.

        Args:
            folder_id: Folder ID to move
            new_parent_id: New parent folder ID

        Returns:
            Updated folder

        Raises:
            FolderNotFoundException: If folder or parent not found
            InvalidParentFolderException: If move would create cycle or already in location
        """
        folder = self.get_folder_by_id(folder_id)

        # Check if folder is already in the target location
        if folder.parent_id == new_parent_id:
            raise InvalidParentFolderException(
                "Folder is already in this location"
            )

        # Validate new parent exists
        new_parent = None
        if new_parent_id is not None:
            new_parent = self.get_folder_by_id(new_parent_id)

            # Check for circular reference
            if self._would_create_cycle(folder_id, new_parent_id):
                raise InvalidParentFolderException(
                    "Cannot move folder into its own descendant"
                )

        # Check for duplicate name in new location (but not the folder itself)
        existing = self.repo.get_by_name_and_parent(folder.name, new_parent_id)
        if existing and existing.id != folder_id:
            raise DuplicateFolderNameException(folder.name)

        # Update folder
        folder.parent_id = new_parent_id
        folder.updated_at = datetime.utcnow()

        # Update paths
        self._update_folder_paths(folder)

        return self.repo.update(folder)

    def _would_create_cycle(self, folder_id: int, new_parent_id: int) -> bool:
        """Check if moving folder would create a circular reference."""
        current_id = new_parent_id
        while current_id is not None:
            if current_id == folder_id:
                return True
            parent = self.repo.get_by_id(current_id)
            if not parent:
                break
            current_id = parent.parent_id
        return False

    def _update_folder_paths(self, folder: Folder) -> None:
        """Recursively update paths for folder and all descendants."""
        # Build new path
        if folder.parent_id is None:
            new_path = f"/{folder.name}"
        else:
            parent = self.repo.get_by_id(folder.parent_id)
            new_path = f"{parent.path.rstrip('/')}/{folder.name}"

        folder.path = new_path

        # Update children paths
        children = self.repo.get_by_parent_id(folder.id)
        for child in children:
            self._update_folder_paths(child)

    def reorder_folders(self, folder_id: int, new_position: int, parent_id: Optional[int]) -> List[Folder]:
        """
        Reorder a folder within its parent.

        Moves the specified folder to the new position and adjusts other folders accordingly.

        Args:
            folder_id: ID of the folder to reorder
            new_position: New position (0-based index) within the parent
            parent_id: Parent ID for validation

        Returns:
            List of all folders in the parent with updated display_order

        Raises:
            FolderNotFoundException: If folder or parent not found
            ValueError: If folder is not in the specified parent
        """
        # Validate folder exists and belongs to parent
        folder = self.get_folder_by_id(folder_id)

        if folder.parent_id != parent_id:
            raise ValueError(f"Folder {folder_id} does not belong to parent {parent_id}")

        # Validate parent exists if not None
        if parent_id is not None:
            parent = self.get_folder_by_id(parent_id)

        # Get all folders in the same parent ordered by current display_order
        all_folders = self.repo.get_by_parent_id(parent_id)

        # Sort by display_order (None values go to end)
        all_folders.sort(key=lambda f: (f.display_order is None, f.display_order or 0, f.created_at))

        if not all_folders:
            return []

        # Validate new_position is within bounds
        if new_position < 0 or new_position >= len(all_folders):
            new_position = max(0, min(new_position, len(all_folders) - 1))

        # Find current position of the folder
        current_position = next((i for i, f in enumerate(all_folders) if f.id == folder_id), None)

        # Reorder the list
        if current_position is not None and current_position != new_position:
            # Remove folder from current position and insert at new position
            folder_to_move = all_folders.pop(current_position)
            all_folders.insert(new_position, folder_to_move)

        # Update display_order for all folders
        for i, f in enumerate(all_folders):
            f.display_order = i
            self.repo.update(f)

        return all_folders
