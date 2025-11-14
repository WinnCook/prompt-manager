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
        prompts = query.order_by(desc(Prompt.created_at)).offset(offset).limit(limit).all()

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
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[Prompt], int]:
        """
        Search prompts by query string.

        Args:
            query: Search query (searches title, description, content, tags)
            folder_id: Optional folder filter
            tags: Optional tag filters
            limit: Number of results
            offset: Pagination offset

        Returns:
            Tuple of (prompts list, total count)
        """
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

        total = db_query.count()
        prompts = db_query.order_by(desc(Prompt.updated_at)).offset(offset).limit(limit).all()

        return prompts, total
