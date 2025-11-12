"""
Prompt service - business logic for prompt operations.
"""
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.models import Prompt, Version
from app.db.repositories.prompt_repository import PromptRepository
from app.db.repositories.folder_repository import FolderRepository
from app.core.exceptions import PromptNotFoundException, FolderNotFoundException


class PromptService:
    """Service for prompt business logic."""

    def __init__(self, db: Session):
        """
        Initialize service with database session.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db
        self.repo = PromptRepository(db)
        self.folder_repo = FolderRepository(db)

    def get_prompts(
        self,
        folder_id: Optional[int] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[Prompt], int]:
        """
        Get prompts with optional folder filter.

        Args:
            folder_id: Filter by folder ID
            limit: Number of results
            offset: Pagination offset

        Returns:
            Tuple of (prompts list, total count)

        Raises:
            FolderNotFoundException: If folder_id provided but folder not found
        """
        # Validate folder exists if provided
        if folder_id is not None:
            folder = self.folder_repo.get_by_id(folder_id)
            if not folder:
                raise FolderNotFoundException(folder_id)

        return self.repo.get_all(folder_id, limit, offset)

    def get_prompt_by_id(self, prompt_id: int) -> Prompt:
        """
        Get prompt by ID with version history.

        Args:
            prompt_id: Prompt ID

        Returns:
            Prompt object

        Raises:
            PromptNotFoundException: If prompt not found
        """
        prompt = self.repo.get_by_id(prompt_id)
        if not prompt:
            raise PromptNotFoundException(prompt_id)
        return prompt

    def create_prompt(
        self,
        folder_id: int,
        title: str,
        content: str,
        tags: Optional[List[str]] = None
    ) -> Prompt:
        """
        Create a new prompt.

        Args:
            folder_id: Folder ID
            title: Prompt title
            content: Prompt content
            tags: Optional list of tags

        Returns:
            Created prompt

        Raises:
            FolderNotFoundException: If folder not found
        """
        # Validate folder exists
        folder = self.folder_repo.get_by_id(folder_id)
        if not folder:
            raise FolderNotFoundException(folder_id)

        # Create prompt
        prompt = Prompt(
            folder_id=folder_id,
            title=title,
            content=content,
            original_content=content,
            tags=",".join(tags) if tags else None,
            is_ai_enhanced=False
        )
        prompt = self.repo.create(prompt)

        # Create initial version
        self._create_version(prompt.id, content, "user")

        return prompt

    def update_prompt(
        self,
        prompt_id: int,
        title: Optional[str] = None,
        content: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Prompt:
        """
        Update an existing prompt.

        Args:
            prompt_id: Prompt ID
            title: New title
            content: New content
            tags: New tags

        Returns:
            Updated prompt

        Raises:
            PromptNotFoundException: If prompt not found
        """
        prompt = self.get_prompt_by_id(prompt_id)

        # Update fields
        if title is not None:
            prompt.title = title
        if content is not None:
            # Create version if content changed
            if prompt.content != content:
                self._create_version(prompt.id, content, "user")
            prompt.content = content
        if tags is not None:
            prompt.tags = ",".join(tags) if tags else None

        prompt.updated_at = datetime.utcnow()

        return self.repo.update(prompt)

    def delete_prompt(self, prompt_id: int) -> None:
        """
        Delete a prompt.

        Args:
            prompt_id: Prompt ID

        Raises:
            PromptNotFoundException: If prompt not found
        """
        prompt = self.get_prompt_by_id(prompt_id)
        self.repo.delete(prompt)

    def move_prompt(self, prompt_id: int, folder_id: int) -> Prompt:
        """
        Move prompt to a different folder.

        Args:
            prompt_id: Prompt ID
            folder_id: New folder ID

        Returns:
            Updated prompt

        Raises:
            PromptNotFoundException: If prompt not found
            FolderNotFoundException: If folder not found
        """
        prompt = self.get_prompt_by_id(prompt_id)

        # Validate new folder exists
        folder = self.folder_repo.get_by_id(folder_id)
        if not folder:
            raise FolderNotFoundException(folder_id)

        # Update prompt
        prompt.folder_id = folder_id
        prompt.updated_at = datetime.utcnow()

        return self.repo.update(prompt)

    def duplicate_prompt(
        self,
        prompt_id: int,
        title: Optional[str] = None,
        folder_id: Optional[int] = None
    ) -> Prompt:
        """
        Duplicate a prompt.

        Args:
            prompt_id: Prompt ID to duplicate
            title: Custom title for copy (defaults to "{original} (Copy)")
            folder_id: Folder ID for copy (defaults to same folder)

        Returns:
            New prompt (copy)

        Raises:
            PromptNotFoundException: If prompt not found
            FolderNotFoundException: If folder_id provided but folder not found
        """
        original = self.get_prompt_by_id(prompt_id)

        # Determine title
        if title is None:
            title = f"{original.title} (Copy)"

        # Determine folder
        target_folder_id = folder_id if folder_id is not None else original.folder_id

        # Validate folder if specified
        if folder_id is not None:
            folder = self.folder_repo.get_by_id(target_folder_id)
            if not folder:
                raise FolderNotFoundException(target_folder_id)

        # Parse tags
        tags = original.tags.split(",") if original.tags else []

        # Create duplicate
        return self.create_prompt(
            folder_id=target_folder_id,
            title=title,
            content=original.content,
            tags=tags
        )

    def _create_version(self, prompt_id: int, content: str, created_by: str) -> Version:
        """Create a version entry for a prompt."""
        version_number = self.repo.get_version_count(prompt_id) + 1
        version = Version(
            prompt_id=prompt_id,
            content=content,
            version_number=version_number,
            created_by=created_by
        )
        return self.repo.create_version(version)
