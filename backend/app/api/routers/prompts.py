"""
Prompt API routes.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.prompt_service import PromptService
from app.services.claude_service import ClaudeService
from app.models.prompt import (
    PromptCreate,
    PromptUpdate,
    PromptMove,
    PromptDuplicate,
    PromptReorder,
    PromptResponse,
    PromptListResponse
)
from pydantic import BaseModel

router = APIRouter(prefix="/api/prompts", tags=["prompts"])


def generate_snippet(content: str, query: str, max_length: int = 150) -> str:
    """
    Generate context snippet around matched query text.

    Args:
        content: Full content text
        query: Search query to find
        max_length: Maximum snippet length

    Returns:
        Context snippet with query match
    """
    if not content or not query:
        return content[:max_length] + ("..." if len(content) > max_length else "")

    query_lower = query.lower()
    content_lower = content.lower()

    # Find first match
    pos = content_lower.find(query_lower)
    if pos == -1:
        # No match found, return start of content
        return content[:max_length] + ("..." if len(content) > max_length else "")

    # Extract context around match (50 chars before, 100 chars after query)
    start = max(0, pos - 50)
    end = min(len(content), pos + len(query) + 100)

    snippet = content[start:end]

    # Add ellipsis if truncated
    if start > 0:
        snippet = "..." + snippet
    if end < len(content):
        snippet = snippet + "..."

    return snippet


@router.get("/search", response_model=PromptListResponse)
def search_prompts(
    q: str = Query(..., min_length=1, description="Search query"),
    folder_id: Optional[int] = Query(None, description="Filter by folder"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    created_after: Optional[str] = Query(None, description="Filter by created date (ISO: YYYY-MM-DD)"),
    created_before: Optional[str] = Query(None, description="Filter by created date (ISO: YYYY-MM-DD)"),
    limit: int = Query(50, ge=1, le=10000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Search prompts by query string with advanced filters.

    Args:
        q: Search query (searches title, description, content, tags)
        folder_id: Optional folder filter
        tags: Optional tag filters
        created_after: Optional date filter (prompts created on or after this date)
        created_before: Optional date filter (prompts created on or before this date)
        limit: Number of results (1-10000)
        offset: Pagination offset
        db: Database session

    Returns:
        List of matching prompts with pagination info and context snippets
    """
    service = PromptService(db)
    prompts, total = service.search_prompts(
        q, folder_id, tags, created_after, created_before, limit, offset
    )

    # Convert tags string to list and add snippet for each prompt
    prompts_data = []
    for prompt in prompts:
        # Generate snippet showing matched context
        snippet = generate_snippet(prompt.content, q)

        prompts_data.append({
            "id": prompt.id,
            "folder_id": prompt.folder_id,
            "title": prompt.title,
            "description": prompt.description,
            "content": prompt.content,
            "snippet": snippet,  # Add context snippet
            "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
            "original_content": prompt.original_content,
            "is_ai_enhanced": prompt.is_ai_enhanced,
            "is_easy_access": prompt.is_easy_access,
            "created_at": prompt.created_at,
            "updated_at": prompt.updated_at,
            "versions": []
        })

    return {
        "prompts": prompts_data,
        "total": total,
        "limit": limit,
        "offset": offset
    }


@router.get("", response_model=PromptListResponse)
def list_prompts(
    folder_id: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=10000),
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
            "description": prompt.description,
            "content": prompt.content,
            "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
            "original_content": prompt.original_content,
            "is_ai_enhanced": prompt.is_ai_enhanced,
            "is_easy_access": prompt.is_easy_access,
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


class PromptEnhanceRequest(BaseModel):
    """Request model for prompt enhancement."""
    custom_instruction: Optional[str] = None


class PromptEnhanceResponse(BaseModel):
    """Response model for prompt enhancement."""
    original: str
    enhanced: str


@router.post("/{prompt_id}/enhance", response_model=PromptEnhanceResponse)
def enhance_prompt(
    prompt_id: int,
    request: PromptEnhanceRequest,
    db: Session = Depends(get_db)
):
    """
    Enhance a prompt using Claude CLI.

    Args:
        prompt_id: Prompt ID to enhance
        request: Enhancement request with optional custom instruction
        db: Database session

    Returns:
        Original and enhanced prompt text
    """
    prompt_service = PromptService(db)
    claude_service = ClaudeService()

    # Get the prompt
    prompt = prompt_service.get_prompt_by_id(prompt_id)

    # Enhance using Claude CLI
    try:
        print(f"[ENHANCE] Starting enhancement for prompt {prompt_id}")
        print(f"[ENHANCE] Original content: {prompt.content[:100]}...")
        enhanced = claude_service.enhance_prompt(
            original_prompt=prompt.content,
            enhancement_instruction=request.custom_instruction
        )
        print(f"[ENHANCE] Success! Enhanced content: {enhanced[:100]}...")

        return {
            "original": prompt.content,
            "enhanced": enhanced
        }
    except Exception as e:
        print(f"[ENHANCE ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        from fastapi import HTTPException
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance prompt: {str(e)}"
        )


class PromptApplyEnhancementRequest(BaseModel):
    """Request model for applying enhancement."""
    enhanced_content: str


@router.post("/{prompt_id}/apply-enhancement", response_model=PromptResponse)
def apply_enhancement(
    prompt_id: int,
    request: PromptApplyEnhancementRequest,
    db: Session = Depends(get_db)
):
    """
    Apply an enhanced version to a prompt (creates new version).

    Args:
        prompt_id: Prompt ID
        request: Request with enhanced content
        db: Database session

    Returns:
        Updated prompt
    """
    service = PromptService(db)

    # Update the prompt with enhanced content (will create version automatically)
    prompt = service.update_prompt(
        prompt_id=prompt_id,
        content=request.enhanced_content
    )

    # Mark as AI enhanced
    prompt.is_ai_enhanced = True
    prompt = service.repo.update(prompt)

    return prompt


@router.get("/easy-access/list", response_model=PromptListResponse)
def list_easy_access_prompts(db: Session = Depends(get_db)):
    """
    Get all prompts marked as easy access.

    Args:
        db: Database session

    Returns:
        List of easy access prompts (max 8)
    """
    service = PromptService(db)
    prompts = service.get_easy_access_prompts()

    # Convert tags string to list for each prompt
    prompts_data = []
    for prompt in prompts:
        prompts_data.append({
            "id": prompt.id,
            "folder_id": prompt.folder_id,
            "title": prompt.title,
            "description": prompt.description,
            "content": prompt.content,
            "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
            "original_content": prompt.original_content,
            "is_ai_enhanced": prompt.is_ai_enhanced,
            "is_easy_access": prompt.is_easy_access,
            "created_at": prompt.created_at,
            "updated_at": prompt.updated_at,
            "versions": []
        })

    return {
        "prompts": prompts_data,
        "total": len(prompts_data),
        "limit": 8,
        "offset": 0
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
        "description": prompt.description,
        "content": prompt.content,
        "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
        "original_content": prompt.original_content,
        "is_ai_enhanced": prompt.is_ai_enhanced,
        "is_easy_access": prompt.is_easy_access,
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
        description=prompt_data.description,
        content=prompt_data.content,
        tags=prompt_data.tags
    )

    # TODO: If auto_enhance is True, trigger Claude enhancement job

    # Convert tags string to list for response
    response_data = {
        "id": prompt.id,
        "folder_id": prompt.folder_id,
        "title": prompt.title,
        "description": prompt.description,
        "content": prompt.content,
        "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
        "original_content": prompt.original_content,
        "is_ai_enhanced": prompt.is_ai_enhanced,
        "is_easy_access": prompt.is_easy_access,
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
        description=prompt_data.description,
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


@router.post("/reorder", response_model=PromptListResponse)
def reorder_prompts(
    reorder_data: PromptReorder,
    db: Session = Depends(get_db)
):
    """
    Reorder a prompt within its folder.

    Moves the specified prompt to a new position and adjusts other prompts
    in the folder accordingly. All prompts will have their display_order updated.

    Args:
        reorder_data: Reorder operation data (prompt_id, new_position, folder_id)
        db: Database session

    Returns:
        List of all prompts in the folder with updated display_order

    Raises:
        404: If prompt or folder not found
        400: If prompt is not in the specified folder
    """
    service = PromptService(db)

    try:
        # Perform reordering
        updated_prompts = service.reorder_prompts(
            prompt_id=reorder_data.prompt_id,
            new_position=reorder_data.new_position,
            folder_id=reorder_data.folder_id
        )

        # Convert to response format
        prompts_data = []
        for prompt in updated_prompts:
            prompts_data.append({
                "id": prompt.id,
                "folder_id": prompt.folder_id,
                "title": prompt.title,
                "description": prompt.description,
                "content": prompt.content,
                "tags": [t.strip() for t in prompt.tags.split(',') if t.strip()] if prompt.tags else [],
                "original_content": prompt.original_content,
                "is_ai_enhanced": prompt.is_ai_enhanced,
                "is_easy_access": prompt.is_easy_access,
                "created_at": prompt.created_at,
                "updated_at": prompt.updated_at,
                "versions": []
            })

        return {
            "prompts": prompts_data,
            "total": len(prompts_data),
            "limit": len(prompts_data),
            "offset": 0
        }

    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/{prompt_id}/easy-access", response_model=PromptResponse)
def toggle_easy_access(
    prompt_id: int,
    enable: bool = Query(..., description="Enable or disable easy access"),
    db: Session = Depends(get_db)
):
    """
    Toggle easy access status for a prompt.

    Maximum of 8 prompts can be marked as easy access. If limit is reached,
    the request will fail with 400 error.

    Args:
        prompt_id: Prompt ID
        enable: True to enable easy access, False to disable
        db: Database session

    Returns:
        Updated prompt

    Raises:
        400: If trying to enable and already at 8-prompt limit
        404: If prompt not found
    """
    service = PromptService(db)

    # Get the prompt
    prompt = service.get_prompt_by_id(prompt_id)

    # If enabling, check the limit
    if enable and not prompt.is_easy_access:
        # Count current easy access prompts
        easy_access_count = service.count_easy_access_prompts()
        if easy_access_count >= 8:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum of 8 prompts can be marked as easy access. Please disable another prompt first."
            )

    # Update the flag
    prompt.is_easy_access = enable
    updated_prompt = service.repo.update(prompt)

    return updated_prompt
