"""
Prompt API routes.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.prompt_service import PromptService
from app.models.prompt import (
    PromptCreate,
    PromptUpdate,
    PromptMove,
    PromptDuplicate,
    PromptResponse,
    PromptListResponse
)

router = APIRouter(prefix="/api/prompts", tags=["prompts"])


@router.get("", response_model=PromptListResponse)
def list_prompts(
    folder_id: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    List prompts with optional folder filter and pagination.

    Args:
        folder_id: Filter by folder ID
        limit: Number of results (1-100)
        offset: Pagination offset
        db: Database session

    Returns:
        List of prompts with pagination info
    """
    service = PromptService(db)
    prompts, total = service.get_prompts(folder_id, limit, offset)

    # Convert tags string to list for each prompt
    prompts_data = []
    for prompt in prompts:
        prompts_data.append({
            "id": prompt.id,
            "folder_id": prompt.folder_id,
            "title": prompt.title,
            "content": prompt.content,
            "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
            "original_content": prompt.original_content,
            "is_ai_enhanced": prompt.is_ai_enhanced,
            "created_at": prompt.created_at,
            "updated_at": prompt.updated_at,
            "versions": []  # Don't load versions in list view for performance
        })

    return {
        "prompts": prompts_data,
        "total": total,
        "limit": limit,
        "offset": offset
    }


@router.get("/{prompt_id}", response_model=PromptResponse)
def get_prompt(prompt_id: int, db: Session = Depends(get_db)):
    """
    Get a single prompt by ID with version history.

    Args:
        prompt_id: Prompt ID
        db: Database session

    Returns:
        Prompt details with versions
    """
    service = PromptService(db)
    prompt = service.get_prompt_by_id(prompt_id)

    # Convert tags string to list for response
    response_data = {
        "id": prompt.id,
        "folder_id": prompt.folder_id,
        "title": prompt.title,
        "content": prompt.content,
        "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
        "original_content": prompt.original_content,
        "is_ai_enhanced": prompt.is_ai_enhanced,
        "created_at": prompt.created_at,
        "updated_at": prompt.updated_at,
        "versions": prompt.versions
    }
    return response_data


@router.post("", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
def create_prompt(prompt_data: PromptCreate, db: Session = Depends(get_db)):
    """
    Create a new prompt.

    Args:
        prompt_data: Prompt creation data
        db: Database session

    Returns:
        Created prompt
    """
    service = PromptService(db)
    prompt = service.create_prompt(
        folder_id=prompt_data.folder_id,
        title=prompt_data.title,
        content=prompt_data.content,
        tags=prompt_data.tags
    )

    # TODO: If auto_enhance is True, trigger Claude enhancement job

    # Convert tags string to list for response
    response_data = {
        "id": prompt.id,
        "folder_id": prompt.folder_id,
        "title": prompt.title,
        "content": prompt.content,
        "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
        "original_content": prompt.original_content,
        "is_ai_enhanced": prompt.is_ai_enhanced,
        "created_at": prompt.created_at,
        "updated_at": prompt.updated_at,
        "versions": prompt.versions
    }
    return response_data


@router.put("/{prompt_id}", response_model=PromptResponse)
def update_prompt(
    prompt_id: int,
    prompt_data: PromptUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing prompt.

    Args:
        prompt_id: Prompt ID
        prompt_data: Prompt update data
        db: Database session

    Returns:
        Updated prompt
    """
    service = PromptService(db)
    prompt = service.update_prompt(
        prompt_id=prompt_id,
        title=prompt_data.title,
        content=prompt_data.content,
        tags=prompt_data.tags
    )
    return prompt


@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    """
    Delete a prompt.

    Args:
        prompt_id: Prompt ID
        db: Database session
    """
    service = PromptService(db)
    service.delete_prompt(prompt_id)


@router.post("/{prompt_id}/move", response_model=PromptResponse)
def move_prompt(
    prompt_id: int,
    move_data: PromptMove,
    db: Session = Depends(get_db)
):
    """
    Move a prompt to a different folder.

    Args:
        prompt_id: Prompt ID
        move_data: Move operation data
        db: Database session

    Returns:
        Updated prompt
    """
    service = PromptService(db)
    prompt = service.move_prompt(prompt_id, move_data.folder_id)
    return prompt


@router.post("/{prompt_id}/duplicate", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
def duplicate_prompt(
    prompt_id: int,
    duplicate_data: PromptDuplicate,
    db: Session = Depends(get_db)
):
    """
    Duplicate a prompt.

    Args:
        prompt_id: Prompt ID to duplicate
        duplicate_data: Duplication options
        db: Database session

    Returns:
        New prompt (copy)
    """
    service = PromptService(db)
    prompt = service.duplicate_prompt(
        prompt_id=prompt_id,
        title=duplicate_data.title,
        folder_id=duplicate_data.folder_id
    )
    return prompt
