"""
Custom exception classes.
"""


class AppException(Exception):
    """Base application exception."""

    def __init__(self, message: str, code: str):
        self.message = message
        self.code = code
        super().__init__(self.message)


class FolderNotFoundException(AppException):
    """Raised when a folder is not found."""

    def __init__(self, folder_id: int):
        super().__init__(
            message=f"Folder with ID {folder_id} not found",
            code="FOLDER_NOT_FOUND"
        )


class PromptNotFoundException(AppException):
    """Raised when a prompt is not found."""

    def __init__(self, prompt_id: int):
        super().__init__(
            message=f"Prompt with ID {prompt_id} not found",
            code="PROMPT_NOT_FOUND"
        )


class InvalidParentFolderException(AppException):
    """Raised when parent folder is invalid."""

    def __init__(self, message: str = "Invalid parent folder"):
        super().__init__(message=message, code="INVALID_PARENT_FOLDER")


class DuplicateFolderNameException(AppException):
    """Raised when folder name already exists in parent."""

    def __init__(self, name: str):
        super().__init__(
            message=f"Folder with name '{name}' already exists in this location",
            code="DUPLICATE_FOLDER_NAME"
        )


class ClaudeJobNotFoundException(AppException):
    """Raised when a Claude job is not found."""

    def __init__(self, job_id: str):
        super().__init__(
            message=f"Claude job with ID {job_id} not found",
            code="CLAUDE_JOB_NOT_FOUND"
        )


class ClaudeJobPendingException(AppException):
    """Raised when Claude job is still pending."""

    def __init__(self, job_id: str):
        super().__init__(
            message=f"Claude job {job_id} is still processing",
            code="CLAUDE_JOB_PENDING"
        )


class ClaudeCLIException(AppException):
    """Raised when Claude CLI encounters an error."""

    def __init__(self, message: str):
        super().__init__(
            message=f"Claude CLI error: {message}",
            code="CLAUDE_CLI_ERROR"
        )


class ProjectNotFoundException(AppException):
    """Raised when a project is not found."""

    def __init__(self, project_id: int):
        super().__init__(
            message=f"Project with ID {project_id} not found",
            code="PROJECT_NOT_FOUND"
        )
