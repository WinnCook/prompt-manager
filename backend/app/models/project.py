"""
Pydantic models for Project API requests and responses.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    """Base project model with shared attributes."""

    title: str = Field(..., min_length=1, max_length=255)
    file_location: str = Field(..., min_length=1, max_length=1000)


class ProjectCreate(ProjectBase):
    """Model for creating a new project."""
    pass


class ProjectUpdate(BaseModel):
    """Model for updating a project."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    file_location: Optional[str] = Field(None, min_length=1, max_length=1000)


class ProjectReorder(BaseModel):
    """Model for reordering projects."""

    project_id: int = Field(..., description="ID of the project to reorder")
    new_position: int = Field(..., ge=0, description="New position (0-based index)")


class ProjectResponse(ProjectBase):
    """Model for project response."""

    id: int
    display_order: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """Model for project list response."""

    projects: List[ProjectResponse]
