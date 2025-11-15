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
- **Voice-to-Text Input**: Microphone button on all text fields for hands-free input with visual feedback
- **Dark Mode**: Toggle between light, dark, and system themes with smooth transitions and persistent preference
- **Resizable Sidebar**: Drag the divider to adjust sidebar width from 200px to 600px, with width persisting across sessions
- **Intuitive Interface**: Left navigation panel, right content area with hover actions
- **Multiple Views**: Toggle between grid and list view with persistent preference
- **Drag-and-Drop Reordering**: Rearrange prompts in list view with smooth animations
- **Folder Management**: Inline rename with pencil icon, up/down arrows to reorder within parent
- **Quick Actions**: Copy, edit, duplicate, and delete with single clicks
- **Keyboard Shortcuts**: Efficient navigation and operations
- **Toast Notifications**: Visual feedback for all operations
- **Confirm Dialogs**: Protection against accidental deletions with detailed stats

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Python 3.11 + FastAPI + SQLAlchemy
- **Database**: SQLite with automatic schema management
- **State Management**: Zustand
- **Drag-and-Drop**: @dnd-kit (modern, accessible drag-and-drop library)
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
│   │   │   ├── SearchBar.tsx
│   │   │   ├── VoiceInputButton.tsx       # Voice input microphone button
│   │   │   ├── TextInputWithVoice.tsx     # Input wrapper with voice support
│   │   │   └── TextAreaWithVoice.tsx      # Textarea wrapper with voice support
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useVoiceInput.ts           # Web Speech API integration
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

### Desktop Shortcut (Quick Launch) - Streamlined!

A desktop shortcut has been created for **silent, popup-free launching**. Simply double-click **"Prompt Manager"** on your desktop to:
- Start both backend and frontend servers **silently** (no terminal windows!)
- Open the application directly in Chrome (or default browser)
- No Electron errors or popups

**Features:**
- ✅ Zero terminal windows
- ✅ No Electron error messages
- ✅ Pinnable to Windows taskbar
- ✅ Opens directly in Chrome app mode

**To create/recreate the shortcut:**
```bash
cd prompt-manager
powershell -ExecutionPolicy Bypass -File create-desktop-shortcut.ps1
```

**To pin to taskbar:**
1. Right-click the "Prompt Manager" desktop shortcut
2. Select "Pin to taskbar"

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
- `POST /api/folders/reorder` - Reorder folder within its parent

### Prompts
- `GET /api/prompts` - List prompts (optional: `?folder_id=X`, `limit=50`, `offset=0`)
- `GET /api/prompts/search` - Search prompts (`?q=query`, optional: `folder_id`, `tags`)
- `GET /api/prompts/{id}` - Get single prompt with version history
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/{id}` - Update prompt
- `DELETE /api/prompts/{id}` - Delete prompt
- `POST /api/prompts/{id}/move` - Move prompt to different folder
- `POST /api/prompts/{id}/duplicate` - Duplicate prompt
- `POST /api/prompts/reorder` - Reorder prompts within a folder

**Note**: List and search endpoints support up to `limit=10000` for bulk operations.

## Database Schema

### Tables

**folders**
- `id` (INTEGER, PRIMARY KEY)
- `name` (VARCHAR(255), NOT NULL)
- `parent_id` (INTEGER, FOREIGN KEY → folders.id)
- `path` (VARCHAR(1000), NOT NULL) - Materialized path for hierarchy
- `display_order` (INTEGER, NULLABLE, INDEXED) - User-defined sort order within parent
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
- `display_order` (INTEGER, NULLABLE, INDEXED) - User-defined sort order within folder
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
The application includes automatic migration scripts in `backend/migrations/` that run on startup:
- `add_display_order.py` (Migration 003): Adds display_order column for prompt reordering
- `add_folder_display_order.py` (Migration 004): Adds display_order column for folder reordering

When adding new fields manually, use SQLite ALTER TABLE:
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

### Voice-to-Text Feature (November 14, 2025) ✅
- **Universal Voice Input**: Added microphone button to all text input fields
- **Web Speech API Integration**: Browser-native speech recognition with continuous listening
- **Visual Feedback**: Animated red pulse indicator during recording
- **Smart Appending**: Voice text appends to existing input without replacing
- **Components Added**:
  - `useVoiceInput` custom hook for speech recognition logic
  - `VoiceInputButton` reusable microphone button component
  - `TextInputWithVoice` wrapper for input fields
  - `TextAreaWithVoice` wrapper for textarea fields
- **Coverage**: SearchBar, EditModal (title/description/content/tags), CommandPalette, VariableFillDialog, NewFolderButton
- **Browser Support**: Chrome, Edge, Safari (WebKit-based browsers)
- **Dark Mode Compatible**: Fully styled for both light and dark themes
- **Graceful Degradation**: Button hidden in unsupported browsers

### Sprint 5: Dark Mode Theme (November 14-15, 2025) ✅
- **Complete Dark Mode**: Implemented full dark theme with CSS variable system
- **Theme Toggle**: Added toggle button with Light/Dark/System auto-detection modes
- **Smooth Transitions**: 0.3s ease transitions when switching themes
- **Persistent Preference**: Theme choice saved to localStorage
- **System Detection**: Automatically detects and follows OS theme preference
- **17 Components Converted**: All UI components support both themes with 142+ color replacements
- **Accessibility Fix**: Resolved selected folder text readability in dark mode
- 13/13 story points completed (100%)

### Sprint 4 UI Enhancement (November 14, 2025) ✅
- **AI Button Sizing**: Doubled AI enhance button size in grid mode (36px → 72px) for improved aesthetics and better visual balance

### Sprint 4 Completion (November 14, 2025) ✅
- **Resizable Sidebar**: Replaced collapse button with draggable divider for flexible width adjustment
- **Drag-to-Resize**: Smooth resizing with visual feedback (hover and drag states)
- **Smart Constraints**: Min 200px, Max 600px to ensure usability
- **Persistent Width**: User's preferred width saved to localStorage

### UX Enhancements (November 14, 2025) ✅
- **Collapsible Sidebar**: ~~Toggle button to collapse/expand folder navigation with persisted state~~ (replaced by resizable divider)
- **Folder Rename**: Inline rename functionality with pencil icon on selected folders
- **Folder Reordering**: Up/down arrow buttons to reorder folders within their parent
- **Improved Error Handling**: Better feedback when dropping folders into same parent
- **Display Order System**: Database-backed folder ordering with migrations
- All existing prompts preserved during migration

### Sprint 3 Completion (November 14, 2025) ✅
- **List View**: Toggle between grid and list view with persistent preference
- **Drag-and-Drop Reordering**: Rearrange prompts in list view with smooth animations
- **Display Order**: Database-backed ordering system that persists across both views
- **@dnd-kit Integration**: Modern, accessible drag-and-drop library
- **Optimistic UI**: Instant feedback with error rollback
- **Migration System**: Automatic database migrations on startup
- 15/15 tasks completed (100%), 36 story points delivered

### Sprint 2 Enhancements
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
