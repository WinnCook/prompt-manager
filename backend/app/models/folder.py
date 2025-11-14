"""
Pydantic models for Folder API requests and responses.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class FolderBase(BaseModel):
    """Base folder model with shared attributes."""

    name: str = Field(..., min_length=1, max_length=255)


class FolderCreate(FolderBase):
    """Model for creating a new folder."""

    parent_id: Optional[int] = None


class FolderUpdate(BaseModel):
    """Model for updating a folder."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)


class FolderMove(BaseModel):
    """Model for moving a folder to a new parent."""

    new_parent_id: Optional[int] = None


class FolderReorder(BaseModel):
    """Model for reordering folders within a parent."""

    folder_id: int = Field(..., description="ID of the folder to reorder")
    new_position: int = Field(..., ge=0, description="New position (0-based index)")
    parent_id: Optional[int] = Field(None, description="Parent ID (for validation)")


class FolderResponse(FolderBase):
    """Model for folder response."""

    id: int
    parent_id: Optional[int]
    path: str
    created_at: datetime
    updated_at: datetime
    children: List["FolderResponse"] = []

    class Config:
        from_attributes = True


class FolderTreeResponse(BaseModel):
    """Model for folder tree response."""

    folders: List[FolderResponse]


# Update forward references
FolderResponse.model_rebuild()
