# Prompt Manager

A professional web application for organizing, managing, and enhancing prompts with AI-powered features and an intuitive folder-based system.

## Overview

Prompt Manager is a productivity tool designed to help users organize their prompt library with hierarchical folder navigation, powerful editing capabilities, version control, and variable substitution system for reusable templates.

## Key Features

### Core Functionality
- **Hierarchical Organization**: Organize prompts in folders and subfolders with drag-and-drop support
- **Full CRUD Operations**: Create, read, update, and delete prompts and folders
- **Smart Search**: Fast search across prompt titles, content, and tags with filtering
- **Variable System**: Define reusable variables with `{{VAR_NAME}}` syntax for template prompts
- **Tag Management**: Categorize prompts with tags for easy filtering
- **Description Field**: Add detailed descriptions to prompts for better organization

### Advanced Features
- **Version Control**: Track original and enhanced versions of prompts
- **AI Enhancement**: (Planned) Automatic prompt rewriting using Claude CLI
- **Duplicate Prompts**: Clone prompts with optional title/folder customization
- **Move Operations**: Move prompts and folders between locations
- **Cascade Delete**: Safely delete folders with automatic cleanup of children and prompts

### UI Features
- **Intuitive Interface**: Left navigation panel, right content area with hover actions
- **Quick Actions**: Copy, edit, duplicate, and delete with single clicks
- **Keyboard Shortcuts**: Efficient navigation and operations
- **Toast Notifications**: Visual feedback for all operations
- **Confirm Dialogs**: Protection against accidental deletions with detailed stats

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Python 3.11 + FastAPI + SQLAlchemy
- **Database**: SQLite with automatic schema management
- **State Management**: Zustand
- **Styling**: CSS Modules
- **AI Integration**: Claude CLI (planned)

## Project Structure

```
prompt-manager/
├── docs/                      # Comprehensive documentation
│   ├── ARCHITECTURE.md        # System architecture and design
│   ├── API_SPEC.md           # API endpoints and contracts
│   ├── ONBOARDING.md         # AI agent onboarding guide
│   └── USER_GUIDE.md         # End-user documentation
├── project-management/        # Agile project management
│   ├── BACKLOG.md            # Product backlog
│   ├── SPRINT_01.md          # Sprint 1 planning
│   ├── SPRINT_02.md          # Sprint 2 planning
│   └── COMPLETED.md          # Completed work tracking
├── backend/                   # Python FastAPI backend
│   ├── .venv/                # Virtual environment
│   ├── app/
│   │   ├── api/
│   │   │   └── routers/      # API route handlers
│   │   │       ├── folders.py
│   │   │       └── prompts.py
│   │   ├── services/         # Business logic layer
│   │   │   ├── folder_service.py
│   │   │   └── prompt_service.py
│   │   ├── models/           # Pydantic request/response models
│   │   │   ├── folder.py
│   │   │   └── prompt.py
│   │   ├── db/
│   │   │   ├── database.py   # Database configuration
│   │   │   ├── models.py     # SQLAlchemy ORM models
│   │   │   └── repositories/ # Data access layer
│   │   ├── core/             # Core utilities
│   │   │   └── exceptions.py
│   │   └── main.py           # FastAPI application entry
│   ├── prompts.db            # SQLite database
│   └── requirements.txt
├── frontend/                  # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── DeleteFolderButton.tsx
│   │   │   ├── FolderTree.tsx
│   │   │   ├── NewFolderButton.tsx
│   │   │   ├── PromptEditor.tsx
│   │   │   ├── PromptList.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── pages/
│   │   │   └── Home.tsx      # Main application page
│   │   ├── services/         # API client services
│   │   │   ├── folderApi.ts
│   │   │   └── promptApi.ts
│   │   ├── store/            # Zustand state management
│   │   │   ├── folderStore.ts
│   │   │   ├── promptStore.ts
│   │   │   └── uiStore.ts
│   │   ├── types/
│   │   │   └── api.ts        # TypeScript type definitions
│   │   └── main.tsx          # React entry point
│   ├── package.json
│   └── vite.config.ts        # Vite configuration
└── README.md
```

## Quick Start

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd prompt-manager/backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   .venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

4. **Run the backend server**:
   ```bash
   .venv\Scripts\python.exe -m app.main
   ```

   Backend will run at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd prompt-manager/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   Frontend will run at `http://localhost:5173`

### First Time Setup

The application automatically initializes the database with a Root folder. All your prompts and folders will be organized within this root structure.

### Desktop Shortcut (Quick Launch)

A desktop shortcut has been created for easy access. Simply double-click **"Prompt Manager"** on your desktop to:
- Start the backend server automatically
- Start the frontend development server
- Open the application in your default browser

The shortcut runs `start-prompt-manager.bat` which handles everything for you!

**To recreate the shortcut:**
```bash
cd prompt-manager
powershell -ExecutionPolicy Bypass -File create-desktop-shortcut.ps1
```

## Development Workflow

This project follows an Agile methodology with:
- Sprint planning in `/project-management/SPRINT_*.md`
- Product backlog in `/project-management/BACKLOG.md`
- Completed work tracking in `/project-management/COMPLETED.md`

## Variable System

Prompts support dynamic variables using double-brace syntax: `{{VARIABLE_NAME}}`

### Usage Examples

```
Hello {{NAME}}, welcome to {{COMPANY}}!

Your order #{{ORDER_ID}} will arrive on {{DELIVERY_DATE}}.
```

Variables are detected automatically and displayed in the UI for easy substitution when using prompts.

## API Endpoints

### Folders
- `GET /api/folders` - Get folder tree (root folder hidden, returns children)
- `POST /api/folders` - Create new folder
- `PUT /api/folders/{id}` - Update folder name
- `DELETE /api/folders/{id}` - Delete folder (protected: root cannot be deleted)
- `POST /api/folders/{id}/move` - Move folder to new parent

### Prompts
- `GET /api/prompts` - List prompts (optional: `?folder_id=X`, `limit=50`, `offset=0`)
- `GET /api/prompts/search` - Search prompts (`?q=query`, optional: `folder_id`, `tags`)
- `GET /api/prompts/{id}` - Get single prompt with version history
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/{id}` - Update prompt
- `DELETE /api/prompts/{id}` - Delete prompt
- `POST /api/prompts/{id}/move` - Move prompt to different folder
- `POST /api/prompts/{id}/duplicate` - Duplicate prompt

**Note**: List and search endpoints support up to `limit=10000` for bulk operations.

## Database Schema

### Tables

**folders**
- `id` (INTEGER, PRIMARY KEY)
- `name` (VARCHAR(255), NOT NULL)
- `parent_id` (INTEGER, FOREIGN KEY → folders.id)
- `path` (VARCHAR(1000), NOT NULL) - Materialized path for hierarchy
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**prompts**
- `id` (INTEGER, PRIMARY KEY)
- `folder_id` (INTEGER, FOREIGN KEY → folders.id, NOT NULL)
- `title` (VARCHAR(255), NOT NULL)
- `description` (VARCHAR(1000), NULLABLE)
- `content` (TEXT, NOT NULL)
- `tags` (VARCHAR(500), NULLABLE) - Comma-separated list
- `original_content` (TEXT, NULLABLE)
- `is_ai_enhanced` (BOOLEAN, DEFAULT FALSE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**versions** (Version history tracking)
- `id` (INTEGER, PRIMARY KEY)
- `prompt_id` (INTEGER, FOREIGN KEY → prompts.id, NOT NULL)
- `content` (TEXT, NOT NULL)
- `created_by` (VARCHAR(100))
- `created_at` (DATETIME)

## Development Notes

### Backend Architecture
- **Layered Design**: Routes → Services → Repositories → Database
- **SQLAlchemy ORM**: All database interactions use SQLAlchemy models
- **Pydantic Validation**: Request/response models ensure type safety
- **Exception Handling**: Custom exceptions for business logic errors
- **Auto-reload**: Uvicorn with `--reload` flag for development

### Frontend Architecture
- **Zustand State**: Three stores (folders, prompts, UI)
- **API Services**: Centralized API clients with error handling
- **Component Structure**: Reusable components with TypeScript interfaces
- **CSS Modules**: Scoped styling per component
- **Hot Module Replacement**: Vite provides instant updates

### Database Migrations
When adding new fields (like `description`), use SQLite ALTER TABLE:
```sql
ALTER TABLE prompts ADD COLUMN description VARCHAR(1000);
```

### Troubleshooting

**Backend not auto-reloading?**
- Manually restart: Kill the process and run `.venv\Scripts\python.exe -m app.main` again
- Check if WatchFiles is installed: `pip install watchfiles`

**Frontend not connecting to backend?**
- Verify backend is running on `http://127.0.0.1:8000`
- Check CORS settings in `backend/app/main.py`
- Ensure frontend API base URL matches in `frontend/src/services/`

**Database errors?**
- Delete `prompts.db` and restart backend to recreate schema
- Check SQLAlchemy models match database schema
- Run manual migrations for schema changes

## Recent Updates

### Sprint 2 Enhancements (Current)
- Added description field for prompts across full stack
- Implemented smart search with tag filtering
- Root folder now hidden from UI (implicit root structure)
- Root folder protected from deletion at backend and frontend
- Fixed duplicate prompt functionality
- Increased API limits to support bulk operations (10,000 items)
- Enhanced folder deletion with statistics (subfolder count, total prompts)

### Sprint 1 Completion
- Full CRUD operations for prompts and folders
- Drag-and-drop prompt movement
- Folder hierarchy with unlimited nesting
- Tag management system
- Variable detection and display
- Toast notifications and confirm dialogs
- Keyboard shortcuts for common operations

## Future Enhancements

- AI-powered prompt enhancement via Claude CLI
- Bulk operations (multi-select, batch delete/move)
- Export/import functionality (JSON, CSV)
- Prompt templates library
- Collaborative features (sharing, comments)
- Advanced search filters and saved searches
- Prompt usage analytics

## Documentation

- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Specification**: [docs/API_SPEC.md](docs/API_SPEC.md)
- **Onboarding Guide**: [docs/ONBOARDING.md](docs/ONBOARDING.md)
- **User Guide**: [docs/USER_GUIDE.md](docs/USER_GUIDE.md)

## License

MIT License
