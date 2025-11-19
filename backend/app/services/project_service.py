"""
Project service - business logic for project operations.
"""
from typing import List
from sqlalchemy.orm import Session

from app.db.models import Project
from app.db.repositories.project_repository import ProjectRepository
from app.core.exceptions import ProjectNotFoundException


class ProjectService:
    """Service for project business logic."""

    def __init__(self, db: Session):
        """
        Initialize service with database session.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db
        self.repo = ProjectRepository(db)

    def get_all_projects(self) -> List[Project]:
        """
        Get all projects ordered by display_order.

        Returns:
            List of projects
        """
        return self.repo.get_all()

    def get_project_by_id(self, project_id: int) -> Project:
        """
        Get project by ID.

        Args:
            project_id: Project ID

        Returns:
            Project object

        Raises:
            ProjectNotFoundException: If project not found
        """
        project = self.repo.get_by_id(project_id)
        if not project:
            raise ProjectNotFoundException(project_id)
        return project

    def create_project(self, title: str, file_location: str) -> Project:
        """
        Create a new project.

        Args:
            title: Project title
            file_location: File path/location

        Returns:
            Created project
        """
        # Set display_order to be at the end
        max_order = self.repo.get_max_display_order()
        new_order = max_order + 1

        project = Project(
            title=title,
            file_location=file_location,
            display_order=new_order
        )

        return self.repo.create(project)

    def update_project(
        self,
        project_id: int,
        title: str = None,
        file_location: str = None
    ) -> Project:
        """
        Update project details.

        Args:
            project_id: Project ID
            title: New title (optional)
            file_location: New file location (optional)

        Returns:
            Updated project

        Raises:
            ProjectNotFoundException: If project not found
        """
        project = self.get_project_by_id(project_id)

        if title is not None:
            project.title = title
        if file_location is not None:
            project.file_location = file_location

        return self.repo.update(project)

    def delete_project(self, project_id: int) -> None:
        """
        Delete a project.

        Args:
            project_id: Project ID

        Raises:
            ProjectNotFoundException: If project not found
        """
        project = self.get_project_by_id(project_id)
        self.repo.delete(project)

    def reorder_project(self, project_id: int, new_position: int) -> Project:
        """
        Reorder a project to a new position.

        Args:
            project_id: Project ID to reorder
            new_position: New position (0-based index)

        Returns:
            Updated project

        Raises:
            ProjectNotFoundException: If project not found
        """
        project = self.get_project_by_id(project_id)
        old_position = project.display_order if project.display_order is not None else 0

        if old_position == new_position:
            return project

        # Get all projects
        all_projects = self.repo.get_all()

        # Create a list sorted by current display_order
        projects_list = []
        for p in all_projects:
            order = p.display_order if p.display_order is not None else 999999
            projects_list.append((order, p))

        projects_list.sort(key=lambda x: x[0])

        # Extract just the project objects in order
        ordered_projects = [p for _, p in projects_list]

        # Find current position of the project we're moving
        current_idx = next(i for i, p in enumerate(ordered_projects) if p.id == project_id)

        # Remove from current position
        moving_project = ordered_projects.pop(current_idx)

        # Insert at new position
        ordered_projects.insert(new_position, moving_project)

        # Update display_order for all projects
        for idx, proj in enumerate(ordered_projects):
            proj.display_order = idx
            self.repo.update(proj)

        # Refresh the moving project to get updated value
        self.db.refresh(project)
        return project
