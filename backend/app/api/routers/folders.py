"""
Folder API routes.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.folder_service import FolderService
from app.models.folder import (
    FolderCreate,
    FolderUpdate,
    FolderMove,
    FolderResponse,
    FolderTreeResponse
)

router = APIRouter(prefix="/api/folders", tags=["folders"])


@router.get("", response_model=FolderTreeResponse)
def get_folder_tree(db: Session = Depends(get_db)):
    """
    Get complete folder tree.

    Returns:
        Folder tree with nested structure
    """
    service = FolderService(db)
    folders = service.get_folder_tree()
    return {"folders": folders}


@router.get("/{folder_id}", response_model=FolderResponse)
def get_folder(folder_id: int, db: Session = Depends(get_db)):
    """
    Get a single folder by ID.

    Args:
        folder_id: Folder ID
        db: Database session

    Returns:
        Folder details
    """
    service = FolderService(db)
    folder = service.get_folder_by_id(folder_id)
    return folder


@router.post("", response_model=FolderResponse, status_code=status.HTTP_201_CREATED)
def create_folder(folder_data: FolderCreate, db: Session = Depends(get_db)):
    """
    Create a new folder.

    Args:
        folder_data: Folder creation data
        db: Database session

    Returns:
        Created folder
    """
    service = FolderService(db)
    folder = service.create_folder(
        name=folder_data.name,
        parent_id=folder_data.parent_id
    )
    return folder


@router.put("/{folder_id}", response_model=FolderResponse)
def update_folder(
    folder_id: int,
    folder_data: FolderUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a folder's name.

    Args:
        folder_id: Folder ID
        folder_data: Folder update data
        db: Database session

    Returns:
        Updated folder
    """
    service = FolderService(db)
    folder = service.update_folder(folder_id, folder_data.name)
    return folder


@router.delete("/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_folder(folder_id: int, db: Session = Depends(get_db)):
    """
    Delete a folder (cascades to children and prompts).

    Args:
        folder_id: Folder ID
        db: Database session
    """
    service = FolderService(db)
    service.delete_folder(folder_id)


@router.post("/{folder_id}/move", response_model=FolderResponse)
def move_folder(
    folder_id: int,
    move_data: FolderMove,
    db: Session = Depends(get_db)
):
    """
    Move a folder to a new parent.

    Args:
        folder_id: Folder ID to move
        move_data: Move operation data
        db: Database session

    Returns:
        Updated folder
    """
    service = FolderService(db)
    folder = service.move_folder(folder_id, move_data.new_parent_id)
    return folder
