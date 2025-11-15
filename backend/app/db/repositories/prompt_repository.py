"""
Prompt repository - data access layer for prompts.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_

from app.db.models import Prompt, Version


class PromptRepository:
    """Repository for prompt database operations."""

    def __init__(self, db: Session):
        """
        Initialize repository with database session.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def get_all(
        self,
        folder_id: Optional[int] = None,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[Prompt], int]:
        """
        Get prompts with optional folder filter and pagination.

        Prompts are ordered by display_order (ascending), then by created_at (descending)
        for prompts without a display_order.

        Args:
            folder_id: Filter by folder ID
            limit: Number of results
            offset: Pagination offset

        Returns:
            Tuple of (prompts list, total count)
        """
        query = self.db.query(Prompt)

        if folder_id is not None:
            query = query.filter(Prompt.folder_id == folder_id)

        total = query.count()

        # Order by display_order first (NULLs last), then by created_at descending
        # This ensures custom-ordered prompts appear first in their order,
        # followed by newly created prompts without display_order
        prompts = query.order_by(
            Prompt.display_order.asc().nullslast(),
            desc(Prompt.created_at)
        ).offset(offset).limit(limit).all()

        return prompts, total

    def get_by_id(self, prompt_id: int) -> Optional[Prompt]:
        """
        Get prompt by ID with versions.

        Args:
            prompt_id: Prompt ID

        Returns:
            Prompt object or None if not found
        """
        return self.db.query(Prompt).filter(Prompt.id == prompt_id).first()

    def create(self, prompt: Prompt) -> Prompt:
        """
        Create a new prompt.

        Args:
            prompt: Prompt object to create

        Returns:
            Created prompt
        """
        self.db.add(prompt)
        self.db.commit()
        self.db.refresh(prompt)
        return prompt

    def update(self, prompt: Prompt) -> Prompt:
        """
        Update an existing prompt.

        Args:
            prompt: Prompt object with updates

        Returns:
            Updated prompt
        """
        self.db.commit()
        self.db.refresh(prompt)
        return prompt

    def delete(self, prompt: Prompt) -> None:
        """
        Delete a prompt.

        Args:
            prompt: Prompt object to delete
        """
        self.db.delete(prompt)
        self.db.commit()

    def create_version(self, version: Version) -> Version:
        """
        Create a version entry.

        Args:
            version: Version object to create

        Returns:
            Created version
        """
        self.db.add(version)
        self.db.commit()
        self.db.refresh(version)
        return version

    def get_version_count(self, prompt_id: int) -> int:
        """
        Get version count for a prompt.

        Args:
            prompt_id: Prompt ID

        Returns:
            Number of versions
        """
        return self.db.query(Version).filter(Version.prompt_id == prompt_id).count()

    def search(
        self,
        query: str,
        folder_id: Optional[int] = None,
        tags: Optional[List[str]] = None,
        created_after: Optional[str] = None,
        created_before: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[Prompt], int]:
        """
        Search prompts by query string with optional filters.

        Args:
            query: Search query (searches title, description, content, tags)
            folder_id: Optional folder filter
            tags: Optional tag filters
            created_after: Optional date filter (ISO format: YYYY-MM-DD)
            created_before: Optional date filter (ISO format: YYYY-MM-DD)
            limit: Number of results
            offset: Pagination offset

        Returns:
            Tuple of (prompts list, total count)
        """
        from datetime import datetime

        db_query = self.db.query(Prompt)

        # Search across title, description, content, and tags
        if query:
            search_filter = or_(
                Prompt.title.ilike(f"%{query}%"),
                Prompt.description.ilike(f"%{query}%"),
                Prompt.content.ilike(f"%{query}%"),
                Prompt.tags.ilike(f"%{query}%")
            )
            db_query = db_query.filter(search_filter)

        # Filter by folder
        if folder_id is not None:
            db_query = db_query.filter(Prompt.folder_id == folder_id)

        # Filter by tags
        if tags:
            for tag in tags:
                db_query = db_query.filter(Prompt.tags.ilike(f"%{tag}%"))

        # Filter by created_after date
        if created_after:
            try:
                after_date = datetime.fromisoformat(created_after)
                db_query = db_query.filter(Prompt.created_at >= after_date)
            except ValueError:
                pass  # Ignore invalid date format

        # Filter by created_before date
        if created_before:
            try:
                before_date = datetime.fromisoformat(created_before)
                # Add one day to include the entire before_date day
                from datetime import timedelta
                before_date = before_date + timedelta(days=1)
                db_query = db_query.filter(Prompt.created_at < before_date)
            except ValueError:
                pass  # Ignore invalid date format

        total = db_query.count()
        prompts = db_query.order_by(desc(Prompt.updated_at)).offset(offset).limit(limit).all()

        return prompts, total

    def count_easy_access(self) -> int:
        """
        Count the number of prompts marked as easy access.

        Returns:
            Count of easy access prompts
        """
        return self.db.query(Prompt).filter(Prompt.is_easy_access == True).count()

    def get_easy_access_prompts(self) -> List[Prompt]:
        """
        Get all prompts marked as easy access.

        Returns:
            List of easy access prompts ordered by easy_access_order, then title (max 8)
        """
        return self.db.query(Prompt).filter(
            Prompt.is_easy_access == True
        ).order_by(
            Prompt.easy_access_order.asc().nulls_last(),
            Prompt.title.asc()
        ).limit(8).all()
