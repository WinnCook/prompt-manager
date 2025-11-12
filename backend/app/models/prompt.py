"""
Pydantic models for Prompt API requests and responses.
"""
from datetime import datetime
from typing import Optional, List, Union
from pydantic import BaseModel, Field, field_validator


class PromptBase(BaseModel):
    """Base prompt model with shared attributes."""

    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    tags: Optional[List[str]] = []


class PromptCreate(PromptBase):
    """Model for creating a new prompt."""

    folder_id: int
    auto_enhance: bool = False


class PromptUpdate(BaseModel):
    """Model for updating a prompt."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = Field(None, min_length=1)
    tags: Optional[List[str]] = None


class PromptMove(BaseModel):
    """Model for moving a prompt to a different folder."""

    folder_id: int


class PromptDuplicate(BaseModel):
    """Model for duplicating a prompt."""

    title: Optional[str] = None
    folder_id: Optional[int] = None


class VersionResponse(BaseModel):
    """Model for version history response."""

    id: int
    version_number: int
    content: str
    created_by: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PromptResponse(BaseModel):
    """Model for prompt response."""

    id: int
    folder_id: int
    title: str
    content: str
    tags: List[str] = []
    original_content: Optional[str]
    is_ai_enhanced: bool
    created_at: datetime
    updated_at: datetime
    versions: List[VersionResponse] = []

    @field_validator('tags', mode='before')
    @classmethod
    def convert_tags(cls, v):
        """Convert comma-separated string to list."""
        if isinstance(v, str):
            return [t.strip() for t in v.split(',') if t.strip()] if v else []
        return v or []

    class Config:
        from_attributes = True


class PromptListResponse(BaseModel):
    """Model for list of prompts response."""

    prompts: List[PromptResponse]
    total: int
    limit: int
    offset: int
