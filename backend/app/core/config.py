"""
Application configuration and settings.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # API Settings
    HOST: str = "127.0.0.1"
    PORT: int = 8003  # Using 8003 to avoid zombie processes on 8002
    DEBUG: bool = True

    # Database Settings
    DATABASE_URL: str = "sqlite:///./prompts.db"

    # Claude CLI Settings
    CLAUDE_CLI_PATH: str = "claude"
    CLAUDE_TIMEOUT: int = 300  # 5 minutes
    CLAUDE_MAX_CONCURRENT_JOBS: int = 3

    # Application Settings
    APP_NAME: str = "Prompt Manager"
    APP_VERSION: str = "0.1.0"

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
