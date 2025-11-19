"""
Project repository - data access layer for projects.
"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.models import Project


class ProjectRepository:
    """Repository for project database operations."""

    def __init__(self, db: Session):
        """
        Initialize repository with database session.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def get_all(self) -> List[Project]:
        """
        Get all projects ordered by display_order.

        Returns:
            List of all projects ordered by display_order, then created_at
        """
        return (self.db.query(Project)
               .order_by(
                   Project.display_order.asc().nulls_last(),
                   Project.created_at.asc()
               )
               .all())

    def get_by_id(self, project_id: int) -> Optional[Project]:
        """
        Get project by ID.

        Args:
            project_id: Project ID

        Returns:
            Project object or None if not found
        """
        return self.db.query(Project).filter(Project.id == project_id).first()

    def create(self, project: Project) -> Project:
        """
        Create a new project.

        Args:
            project: Project object to create

        Returns:
            Created project
        """
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update(self, project: Project) -> Project:
        """
        Update an existing project.

        Args:
            project: Project object with updated values

        Returns:
            Updated project
        """
        self.db.commit()
        self.db.refresh(project)
        return project

    def delete(self, project: Project) -> None:
        """
        Delete a project.

        Args:
            project: Project object to delete
        """
        self.db.delete(project)
        self.db.commit()

    def count(self) -> int:
        """
        Count total number of projects.

        Returns:
            Number of projects
        """
        return self.db.query(Project).count()

    def get_max_display_order(self) -> int:
        """
        Get the maximum display_order value.

        Returns:
            Maximum display_order or 0 if no projects exist
        """
        result = self.db.query(Project.display_order).order_by(
            Project.display_order.desc()
        ).first()
        return result[0] if result and result[0] is not None else 0

    def get_projects_in_range(self, start: int, end: int) -> List[Project]:
        """
        Get projects with display_order in range [start, end].

        Args:
            start: Start of range (inclusive)
            end: End of range (inclusive)

        Returns:
            List of projects in the range
        """
        return (self.db.query(Project)
               .filter(Project.display_order >= start)
               .filter(Project.display_order <= end)
               .order_by(Project.display_order.asc())
               .all())
