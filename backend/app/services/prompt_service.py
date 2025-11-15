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
        description: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Prompt:
        """
        Create a new prompt.

        Args:
            folder_id: Folder ID
            title: Prompt title
            content: Prompt content
            description: Optional description
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

        # Get the next display_order for this folder
        all_prompts, _ = self.repo.get_all(folder_id=folder_id, limit=10000, offset=0)
        max_order = 0
        for p in all_prompts:
            if p.display_order is not None and p.display_order > max_order:
                max_order = p.display_order
        next_display_order = max_order + 1

        # Create prompt
        prompt = Prompt(
            folder_id=folder_id,
            title=title,
            description=description,
            content=content,
            original_content=content,
            tags=",".join(tags) if tags else None,
            is_ai_enhanced=False,
            display_order=next_display_order
        )
        prompt = self.repo.create(prompt)

        # Create initial version
        self._create_version(prompt.id, content, "user")

        return prompt

    def update_prompt(
        self,
        prompt_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        content: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Prompt:
        """
        Update an existing prompt.

        Args:
            prompt_id: Prompt ID
            title: New title
            description: New description
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
        if description is not None:
            prompt.description = description
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

    def search_prompts(
        self,
        query: str,
        folder_id: Optional[int] = None,
        tags: Optional[List[str]] = None,
        created_after: Optional[str] = None,
        created_before: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[Prompt], int]:
        """
        Search prompts by query string with optional filters.

        Args:
            query: Search query
            folder_id: Optional folder filter
            tags: Optional tag filters
            created_after: Optional date filter (ISO format: YYYY-MM-DD)
            created_before: Optional date filter (ISO format: YYYY-MM-DD)
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

        return self.repo.search(query, folder_id, tags, created_after, created_before, limit, offset)

    def reorder_prompts(self, prompt_id: int, new_position: int, folder_id: int) -> List[Prompt]:
        """
        Reorder a prompt within its folder.

        Moves the specified prompt to the new position and adjusts other prompts accordingly.

        Args:
            prompt_id: ID of the prompt to reorder
            new_position: New position (0-based index) in the folder
            folder_id: Folder ID for validation

        Returns:
            List of all prompts in the folder with updated display_order

        Raises:
            PromptNotFoundException: If prompt not found
            FolderNotFoundException: If folder not found
            ValueError: If prompt is not in the specified folder
        """
        # Validate prompt exists and belongs to folder
        prompt = self.repo.get_by_id(prompt_id)
        if not prompt:
            raise PromptNotFoundException(prompt_id)

        if prompt.folder_id != folder_id:
            raise ValueError(f"Prompt {prompt_id} does not belong to folder {folder_id}")

        # Validate folder exists
        folder = self.folder_repo.get_by_id(folder_id)
        if not folder:
            raise FolderNotFoundException(folder_id)

        # Get all prompts in the folder ordered by current display_order
        all_prompts, _ = self.repo.get_all(folder_id=folder_id, limit=10000, offset=0)

        if not all_prompts:
            return []

        # Validate new_position is within bounds
        if new_position < 0 or new_position >= len(all_prompts):
            new_position = max(0, min(new_position, len(all_prompts) - 1))

        # Find current position of the prompt
        current_position = None
        for i, p in enumerate(all_prompts):
            if p.id == prompt_id:
                current_position = i
                break

        if current_position is None:
            # Prompt not in list, shouldn't happen but handle it
            current_position = len(all_prompts)

        # Reorder the list
        if current_position != new_position:
            # Remove prompt from current position
            prompt_to_move = all_prompts.pop(current_position)
            # Insert at new position
            all_prompts.insert(new_position, prompt_to_move)

        # Update display_order for all prompts
        for i, p in enumerate(all_prompts):
            p.display_order = i
            self.db.add(p)

        self.db.commit()

        # Refresh all prompts to get updated values
        for p in all_prompts:
            self.db.refresh(p)

        return all_prompts

    def count_easy_access_prompts(self) -> int:
        """
        Count the number of prompts marked as easy access.

        Returns:
            Count of easy access prompts
        """
        return self.repo.count_easy_access()

    def get_easy_access_prompts(self) -> List[Prompt]:
        """
        Get all prompts marked as easy access.

        Returns:
            List of easy access prompts (max 8)
        """
        return self.repo.get_easy_access_prompts()

    def reorder_easy_access_prompts(self, prompt_id: int, new_position: int) -> List[Prompt]:
        """
        Reorder easy access prompts.

        Moves the specified easy access prompt to the new position and adjusts
        other easy access prompts accordingly.

        Args:
            prompt_id: ID of the prompt to reorder
            new_position: New position (0-based index) in the easy access list

        Returns:
            List of all easy access prompts with updated easy_access_order

        Raises:
            PromptNotFoundException: If prompt not found
            ValueError: If prompt is not marked as easy access
        """
        # Validate prompt exists and is easy access
        prompt = self.repo.get_by_id(prompt_id)
        if not prompt:
            raise PromptNotFoundException(prompt_id)

        if not prompt.is_easy_access:
            raise ValueError(f"Prompt {prompt_id} is not marked as easy access")

        # Get all easy access prompts ordered by current easy_access_order
        all_prompts = self.repo.get_easy_access_prompts()

        if not all_prompts:
            return []

        # Validate new_position is within bounds
        if new_position < 0 or new_position >= len(all_prompts):
            new_position = max(0, min(new_position, len(all_prompts) - 1))

        # Find current position of the prompt
        current_position = None
        for i, p in enumerate(all_prompts):
            if p.id == prompt_id:
                current_position = i
                break

        if current_position is None:
            # Prompt not in list, shouldn't happen but handle it
            current_position = len(all_prompts)

        # Reorder the list
        if current_position != new_position:
            # Remove prompt from current position
            prompt_to_move = all_prompts.pop(current_position)
            # Insert at new position
            all_prompts.insert(new_position, prompt_to_move)

        # Update easy_access_order for all prompts
        for i, p in enumerate(all_prompts):
            p.easy_access_order = i + 1  # 1-based ordering
            self.repo.update(p)

        return all_prompts

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
