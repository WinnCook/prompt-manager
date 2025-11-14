"""
SQLAlchemy database models.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Folder(Base):
    """Folder model for organizing prompts."""

    __tablename__ = "folders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    parent_id = Column(Integer, ForeignKey("folders.id", ondelete="CASCADE"), nullable=True)
    path = Column(String(1000), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    parent = relationship("Folder", remote_side=[id], backref="children")
    prompts = relationship("Prompt", back_populates="folder", cascade="all, delete-orphan")


class Prompt(Base):
    """Prompt model for storing user prompts."""

    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    folder_id = Column(Integer, ForeignKey("folders.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    content = Column(Text, nullable=False)
    original_content = Column(Text, nullable=True)
    is_ai_enhanced = Column(Boolean, default=False)
    tags = Column(String(1000), nullable=True)  # Comma-separated tags
    display_order = Column(Integer, nullable=True, index=True)  # User-defined sort order within folder
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    folder = relationship("Folder", back_populates="prompts")
    versions = relationship("Version", back_populates="prompt", cascade="all, delete-orphan")
    claude_jobs = relationship("ClaudeJob", back_populates="prompt", cascade="all, delete-orphan")


class Version(Base):
    """Version history for prompts."""

    __tablename__ = "versions"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    version_number = Column(Integer, nullable=False)
    created_by = Column(String(50), nullable=True)  # 'user' or 'claude'
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    prompt = relationship("Prompt", back_populates="versions")


class ClaudeJob(Base):
    """Claude CLI enhancement jobs."""

    __tablename__ = "claude_jobs"

    id = Column(String(50), primary_key=True)  # UUID
    prompt_id = Column(Integer, ForeignKey("prompts.id", ondelete="CASCADE"), nullable=False)
    original_content = Column(Text, nullable=False)
    enhanced_content = Column(Text, nullable=True)
    status = Column(String(20), nullable=False)  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    prompt = relationship("Prompt", back_populates="claude_jobs")
