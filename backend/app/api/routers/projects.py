"""
Project API routes.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.project_service import ProjectService
from app.models.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectReorder,
    ProjectResponse,
    ProjectListResponse
)

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=ProjectListResponse)
def get_projects(db: Session = Depends(get_db)):
    """
    Get all projects ordered by display_order.

    Returns:
        List of all projects
    """
    service = ProjectService(db)
    projects = service.get_all_projects()
    return {"projects": projects}


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """
    Get a single project by ID.

    Args:
        project_id: Project ID
        db: Database session

    Returns:
        Project details

    Raises:
        404: If project not found
    """
    service = ProjectService(db)
    project = service.get_project_by_id(project_id)
    return project


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    """
    Create a new project.

    Args:
        project_data: Project creation data (title, file_location)
        db: Database session

    Returns:
        Created project
    """
    service = ProjectService(db)
    project = service.create_project(
        title=project_data.title,
        file_location=project_data.file_location
    )
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing project.

    Args:
        project_id: Project ID
        project_data: Project update data (title, file_location)
        db: Database session

    Returns:
        Updated project

    Raises:
        404: If project not found
    """
    service = ProjectService(db)
    project = service.update_project(
        project_id=project_id,
        title=project_data.title,
        file_location=project_data.file_location
    )
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """
    Delete a project.

    Args:
        project_id: Project ID
        db: Database session

    Raises:
        404: If project not found
    """
    service = ProjectService(db)
    service.delete_project(project_id)
    return None


@router.post("/reorder", response_model=ProjectListResponse)
def reorder_projects(
    reorder_data: ProjectReorder,
    db: Session = Depends(get_db)
):
    """
    Reorder a project to a new position.

    Moves the specified project to a new position and adjusts
    display_order for all other projects accordingly.

    Args:
        reorder_data: Reorder operation data (project_id, new_position)
        db: Database session

    Returns:
        Complete list of projects with updated display_order

    Raises:
        404: If project not found
    """
    service = ProjectService(db)

    # Perform reordering
    service.reorder_project(
        project_id=reorder_data.project_id,
        new_position=reorder_data.new_position
    )

    # Return complete project list
    projects = service.get_all_projects()
    return {"projects": projects}
