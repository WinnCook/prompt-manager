# API Specification

## Base URL

```
http://localhost:8000/api
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Folders API

### Get Folder Tree

Retrieves the complete folder hierarchy.

**Endpoint**: `GET /api/folders`

**Response**:
```json
{
  "success": true,
  "data": {
    "folders": [
      {
        "id": 1,
        "name": "Root",
        "parent_id": null,
        "path": "/",
        "children": [
          {
            "id": 2,
            "name": "Work",
            "parent_id": 1,
            "path": "/Work",
            "children": []
          }
        ],
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Create Folder

Creates a new folder.

**Endpoint**: `POST /api/folders`

**Request Body**:
```json
{
  "name": "New Folder",
  "parent_id": 1
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "New Folder",
    "parent_id": 1,
    "path": "/Work/New Folder",
    "created_at": "2025-01-15T10:35:00Z",
    "updated_at": "2025-01-15T10:35:00Z"
  }
}
```

### Update Folder

Updates folder name.

**Endpoint**: `PUT /api/folders/{folder_id}`

**Request Body**:
```json
{
  "name": "Updated Name"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Updated Name",
    "parent_id": 1,
    "path": "/Work/Updated Name",
    "updated_at": "2025-01-15T10:40:00Z"
  }
}
```

### Delete Folder

Deletes a folder and all its contents (cascades to subfolders and prompts).

**Endpoint**: `DELETE /api/folders/{folder_id}`

**Response**:
```json
{
  "success": true,
  "message": "Folder deleted successfully"
}
```

### Move Folder

Moves a folder to a new parent.

**Endpoint**: `POST /api/folders/{folder_id}/move`

**Request Body**:
```json
{
  "new_parent_id": 2
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Updated Name",
    "parent_id": 2,
    "path": "/Work/Projects/Updated Name",
    "updated_at": "2025-01-15T10:45:00Z"
  }
}
```

---

## Prompts API

### List Prompts

Retrieves prompts, optionally filtered by folder.

**Endpoint**: `GET /api/prompts`

**Query Parameters**:
- `folder_id` (optional): Filter by folder ID
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example**: `GET /api/prompts?folder_id=2&limit=20`

**Response**:
```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "id": 1,
        "folder_id": 2,
        "title": "Code Review Prompt",
        "content": "Review this code for best practices...",
        "original_content": "Check this code...",
        "is_ai_enhanced": true,
        "tags": ["code", "review"],
        "created_at": "2025-01-15T09:00:00Z",
        "updated_at": "2025-01-15T09:05:00Z"
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Prompt

Retrieves a single prompt by ID.

**Endpoint**: `GET /api/prompts/{prompt_id}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "folder_id": 2,
    "title": "Code Review Prompt",
    "content": "Review this code for best practices...",
    "original_content": "Check this code...",
    "is_ai_enhanced": true,
    "tags": ["code", "review"],
    "versions": [
      {
        "id": 1,
        "version_number": 1,
        "content": "Check this code...",
        "created_by": "user",
        "created_at": "2025-01-15T09:00:00Z"
      },
      {
        "id": 2,
        "version_number": 2,
        "content": "Review this code for best practices...",
        "created_by": "claude",
        "created_at": "2025-01-15T09:05:00Z"
      }
    ],
    "created_at": "2025-01-15T09:00:00Z",
    "updated_at": "2025-01-15T09:05:00Z"
  }
}
```

### Create Prompt

Creates a new prompt.

**Endpoint**: `POST /api/prompts`

**Request Body**:
```json
{
  "folder_id": 2,
  "title": "New Prompt",
  "content": "Write a function that...",
  "tags": ["coding", "function"],
  "auto_enhance": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "folder_id": 2,
    "title": "New Prompt",
    "content": "Write a function that...",
    "original_content": "Write a function that...",
    "is_ai_enhanced": false,
    "tags": ["coding", "function"],
    "claude_job_id": "job_abc123",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
}
```

**Note**: If `auto_enhance` is true, a Claude job is automatically created and `claude_job_id` is returned.

### Update Prompt

Updates an existing prompt.

**Endpoint**: `PUT /api/prompts/{prompt_id}`

**Request Body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["updated", "tags"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "folder_id": 2,
    "title": "Updated Title",
    "content": "Updated content...",
    "tags": ["updated", "tags"],
    "updated_at": "2025-01-15T10:10:00Z"
  }
}
```

### Delete Prompt

Deletes a prompt.

**Endpoint**: `DELETE /api/prompts/{prompt_id}`

**Response**:
```json
{
  "success": true,
  "message": "Prompt deleted successfully"
}
```

### Move Prompt

Moves a prompt to a different folder.

**Endpoint**: `POST /api/prompts/{prompt_id}/move`

**Request Body**:
```json
{
  "folder_id": 3
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "folder_id": 3,
    "updated_at": "2025-01-15T10:15:00Z"
  }
}
```

### Duplicate Prompt

Creates a copy of a prompt.

**Endpoint**: `POST /api/prompts/{prompt_id}/duplicate`

**Request Body** (optional):
```json
{
  "title": "Custom Copy Name",
  "folder_id": 4
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "folder_id": 4,
    "title": "Custom Copy Name",
    "content": "Write a function that...",
    "original_content": "Write a function that...",
    "is_ai_enhanced": false,
    "tags": ["coding", "function"],
    "created_at": "2025-01-15T10:20:00Z",
    "updated_at": "2025-01-15T10:20:00Z"
  }
}
```

**Note**: If no custom title provided, defaults to "{original_title} (Copy)"

---

## Claude Integration API

### Submit for Rewrite

Submits a prompt for AI enhancement.

**Endpoint**: `POST /api/claude/rewrite`

**Request Body**:
```json
{
  "prompt_id": 2,
  "content": "Write a function that..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "job_id": "job_abc123",
    "status": "pending",
    "created_at": "2025-01-15T10:25:00Z"
  }
}
```

### Check Job Status

Checks the status of a Claude rewrite job.

**Endpoint**: `GET /api/claude/status/{job_id}`

**Response** (Pending):
```json
{
  "success": true,
  "data": {
    "job_id": "job_abc123",
    "status": "processing",
    "created_at": "2025-01-15T10:25:00Z"
  }
}
```

**Response** (Complete):
```json
{
  "success": true,
  "data": {
    "job_id": "job_abc123",
    "status": "completed",
    "created_at": "2025-01-15T10:25:00Z",
    "completed_at": "2025-01-15T10:26:00Z"
  }
}
```

**Response** (Error):
```json
{
  "success": true,
  "data": {
    "job_id": "job_abc123",
    "status": "failed",
    "error_message": "Claude CLI timeout",
    "created_at": "2025-01-15T10:25:00Z",
    "completed_at": "2025-01-15T10:28:00Z"
  }
}
```

### Get Rewrite Result

Retrieves the enhanced prompt result.

**Endpoint**: `GET /api/claude/result/{job_id}`

**Response**:
```json
{
  "success": true,
  "data": {
    "job_id": "job_abc123",
    "original_content": "Write a function that...",
    "enhanced_content": "Create a well-documented function that implements...",
    "status": "completed",
    "created_at": "2025-01-15T10:25:00Z",
    "completed_at": "2025-01-15T10:26:00Z"
  }
}
```

### Accept Enhancement

Accepts the AI-enhanced version and updates the prompt.

**Endpoint**: `POST /api/claude/accept/{job_id}`

**Response**:
```json
{
  "success": true,
  "data": {
    "prompt_id": 2,
    "updated_content": "Create a well-documented function that implements...",
    "is_ai_enhanced": true
  },
  "message": "Enhancement accepted and prompt updated"
}
```

---

## Search API

### Search Prompts

Searches prompts by title or content.

**Endpoint**: `GET /api/search`

**Query Parameters**:
- `q`: Search query (required)
- `folder_id` (optional): Limit search to folder
- `limit` (optional): Number of results (default: 20)

**Example**: `GET /api/search?q=function&limit=10`

**Response**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": 2,
        "folder_id": 2,
        "title": "New Prompt",
        "content": "Write a function that...",
        "match_score": 0.95,
        "highlighted": "Write a <mark>function</mark> that..."
      }
    ],
    "query": "function",
    "total": 1
  }
}
```

---

## WebSocket API (Future)

For real-time updates when Claude jobs complete.

**Endpoint**: `ws://localhost:8000/ws`

**Message Format**:
```json
{
  "type": "claude_job_completed",
  "data": {
    "job_id": "job_abc123",
    "prompt_id": 2,
    "status": "completed"
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `FOLDER_NOT_FOUND` | Folder with specified ID doesn't exist |
| `PROMPT_NOT_FOUND` | Prompt with specified ID doesn't exist |
| `INVALID_PARENT_FOLDER` | Parent folder is invalid or would create cycle |
| `DUPLICATE_FOLDER_NAME` | Folder name already exists in parent |
| `CLAUDE_CLI_ERROR` | Error invoking Claude CLI |
| `CLAUDE_JOB_NOT_FOUND` | Claude job ID doesn't exist |
| `CLAUDE_JOB_PENDING` | Job still processing, result not ready |
| `VALIDATION_ERROR` | Request body validation failed |
| `DATABASE_ERROR` | Internal database error |

---

## Rate Limiting (Future)

Currently no rate limiting. Future versions may implement:
- 100 requests per minute per client
- 10 concurrent Claude jobs per client

---

## Versioning

Current version: `v1`

All endpoints are prefixed with `/api` (version 1 is implicit).

Future versions will use: `/api/v2`, `/api/v3`, etc.
