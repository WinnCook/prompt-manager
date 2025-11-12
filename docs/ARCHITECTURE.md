# System Architecture

## Overview

Prompt Manager is a desktop application built with a client-server architecture, where the Electron frontend communicates with a local FastAPI backend server.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Desktop App                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    React Frontend                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │ Navigation   │  │ Prompt Cards │  │ Edit Modal  │ │ │
│  │  │ Tree (Left)  │  │ (Right Panel)│  │             │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         API Service Layer (Axios)                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST
                        │ (localhost:8000)
┌───────────────────────▼─────────────────────────────────────┐
│                   FastAPI Backend Server                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     API Layer                           │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │ Folders  │ │ Prompts  │ │ Claude   │ │ Search   │ │ │
│  │  │ Router   │ │ Router   │ │ Router   │ │ Router   │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Service Layer                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │ Folder       │  │ Prompt       │  │ Claude CLI  │ │ │
│  │  │ Service      │  │ Service      │  │ Service     │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Data Access Layer                      │ │
│  │  ┌──────────────┐  ┌──────────────┐                   │ │
│  │  │ Folder       │  │ Prompt       │                   │ │
│  │  │ Repository   │  │ Repository   │                   │ │
│  │  └──────────────┘  └──────────────┘                   │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      SQLite Database                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   folders    │  │   prompts    │  │  versions    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (Electron + React)

#### Main Process (Electron)
- **Responsibility**: Application lifecycle, window management, system tray
- **Technology**: Node.js + Electron
- **Key Features**:
  - Auto-start backend server on launch
  - Handle window state (minimize, maximize, close)
  - System tray integration

#### Renderer Process (React)
- **Responsibility**: UI rendering and user interaction
- **Technology**: React 18 + TypeScript
- **Key Components**:
  - `NavigationTree`: Left panel folder/subfolder tree
  - `PromptGrid`: Right panel prompt card display
  - `PromptCard`: Individual prompt with hover actions (copy, edit, duplicate)
  - `EditModal`: Prompt editing interface
  - `ClaudeRewritePanel`: Shows AI-enhanced version with accept/reject options

#### State Management
- **Technology**: React Context + Hooks (or Zustand for complex state)
- **Stores**:
  - `FolderStore`: Folder tree structure and selection
  - `PromptStore`: Prompts data and CRUD operations
  - `UIStore`: Modal state, loading states, notifications

### Backend (FastAPI)

#### API Layer
RESTful API endpoints organized by domain:

**Folders API** (`/api/folders`)
- `GET /api/folders` - Get folder tree
- `POST /api/folders` - Create folder
- `PUT /api/folders/{id}` - Update folder
- `DELETE /api/folders/{id}` - Delete folder (with cascade)
- `POST /api/folders/{id}/move` - Move folder

**Prompts API** (`/api/prompts`)
- `GET /api/prompts` - List prompts (with folder filter)
- `GET /api/prompts/{id}` - Get prompt details
- `POST /api/prompts` - Create prompt
- `PUT /api/prompts/{id}` - Update prompt
- `DELETE /api/prompts/{id}` - Delete prompt
- `POST /api/prompts/{id}/move` - Move prompt to folder
- `POST /api/prompts/{id}/duplicate` - Duplicate prompt

**Claude Integration API** (`/api/claude`)
- `POST /api/claude/rewrite` - Submit prompt for AI enhancement
- `GET /api/claude/status/{job_id}` - Check rewrite job status
- `GET /api/claude/result/{job_id}` - Get rewrite result

**Search API** (`/api/search`)
- `GET /api/search` - Search prompts by content/title

#### Service Layer
Business logic and orchestration:

- **FolderService**: Folder CRUD, tree building, validation
- **PromptService**: Prompt CRUD, version management, duplication
- **ClaudeService**: Claude CLI integration, async job management
- **SearchService**: Full-text search implementation

#### Data Access Layer
Database operations:

- **FolderRepository**: SQL queries for folders table
- **PromptRepository**: SQL queries for prompts table
- **VersionRepository**: SQL queries for versions table

### Database Schema

#### `folders` Table
```sql
CREATE TABLE folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

#### `prompts` Table
```sql
CREATE TABLE prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    folder_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    original_content TEXT,
    is_ai_enhanced BOOLEAN DEFAULT 0,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

#### `versions` Table
```sql
CREATE TABLE versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    created_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
);
```

#### `claude_jobs` Table
```sql
CREATE TABLE claude_jobs (
    id TEXT PRIMARY KEY,
    prompt_id INTEGER NOT NULL,
    original_content TEXT NOT NULL,
    enhanced_content TEXT,
    status TEXT NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
);
```

## Data Flow

### Creating a New Prompt with AI Enhancement

1. User enters prompt text in the edit modal
2. Frontend sends `POST /api/prompts` with content
3. Backend saves prompt to database
4. Backend automatically triggers `ClaudeService.rewrite()`
5. Claude CLI executes in background subprocess
6. Job status stored in `claude_jobs` table
7. Frontend polls `GET /api/claude/status/{job_id}`
8. When complete, frontend displays enhanced version
9. User can accept (update prompt) or reject (keep original)

### Drag and Drop Prompt to Folder

1. User drags `PromptCard` component
2. User drops on target folder in `NavigationTree`
3. Frontend sends `POST /api/prompts/{id}/move` with `folder_id`
4. Backend updates `prompt.folder_id` in database
5. Frontend refreshes prompt list for current folder

## Security Considerations

1. **Local-Only**: Backend server binds to `127.0.0.1` only
2. **No Authentication**: Intended for single-user local use
3. **Input Validation**: All user input validated with Pydantic models
4. **SQL Injection**: Protected by SQLAlchemy ORM
5. **Claude CLI**: Executes in controlled subprocess with timeout

## Performance Considerations

1. **Lazy Loading**: Load prompts only for selected folder
2. **Indexing**: Database indexes on `folder_id`, `created_at`
3. **Caching**: Frontend caches folder tree structure
4. **Async Operations**: Claude CLI integration is fully async
5. **Pagination**: Implement pagination for folders with many prompts

## Error Handling

1. **Frontend**: Try-catch blocks with user-friendly error messages
2. **Backend**: FastAPI exception handlers for consistent error responses
3. **Database**: Transaction rollback on errors
4. **Claude Integration**: Timeout handling, retry logic for transient failures

## Testing Strategy

1. **Unit Tests**: Services and repositories (pytest)
2. **Integration Tests**: API endpoints (pytest + TestClient)
3. **E2E Tests**: Frontend user flows (Playwright)
4. **Manual Testing**: UI/UX validation

## Deployment

1. **Development**: Run backend and frontend separately
2. **Production**: Package as single Electron app with embedded Python
3. **Distribution**: Electron-builder for Windows/macOS/Linux installers

## Future Enhancements

1. **Cloud Sync**: Optional cloud backup/sync
2. **Collaboration**: Share prompts with teams
3. **Analytics**: Track prompt usage and effectiveness
4. **Templates**: Pre-built prompt templates
5. **Keyboard Shortcuts**: Power-user features
6. **Export/Import**: Backup and migration utilities
