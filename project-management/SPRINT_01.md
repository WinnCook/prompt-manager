# Sprint 1: Foundation

**Sprint Duration**: 2 weeks
**Sprint Goal**: Build the foundational backend, database, and basic frontend with core CRUD operations for folders and prompts.

**Start Date**: TBD
**End Date**: TBD

---

## Sprint Objectives

1. Set up project infrastructure (backend + frontend)
2. Implement database schema and migrations
3. Build folder and prompt CRUD APIs
4. Create basic frontend with folder navigation
5. Implement prompt display and basic actions

---

## Sprint Backlog

### 1. Backend Infrastructure

#### S1-001: Project Setup and Dependencies
**Story Points**: 2
**Priority**: Critical
**Assigned To**: TBD

**Tasks**:
- [ ] Create FastAPI project structure
- [ ] Set up virtual environment
- [ ] Install core dependencies (FastAPI, SQLAlchemy, Pydantic, etc.)
- [ ] Create requirements.txt
- [ ] Set up basic FastAPI app with CORS
- [ ] Create main.py with basic routes
- [ ] Verify server runs on localhost:8000

**Acceptance Criteria**:
- FastAPI server starts without errors
- Health check endpoint returns 200 OK
- API documentation accessible at /docs
- CORS configured for local development

**Dependencies**: None

---

#### S1-002: Database Schema and Setup
**Story Points**: 5
**Priority**: Critical
**Assigned To**: TBD

**Tasks**:
- [ ] Install SQLite and SQLAlchemy
- [ ] Create database models (Folder, Prompt, Version, ClaudeJob)
- [ ] Implement database initialization
- [ ] Create database connection manager
- [ ] Write schema migration script
- [ ] Add seed data for testing (root folder)
- [ ] Test database CRUD operations

**Acceptance Criteria**:
- Database file created at correct location
- All tables created with proper schema
- Foreign key constraints working
- Cascade deletes configured
- Root folder auto-created on first run

**Dependencies**: S1-001

**Files to Create**:
- `backend/app/db/database.py` - DB connection
- `backend/app/db/models.py` - SQLAlchemy models
- `backend/app/db/init_db.py` - DB initialization
- `backend/app/db/schemas.sql` - Raw SQL schemas (reference)

---

#### S1-003: Folder CRUD API
**Story Points**: 5
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create Pydantic models for Folder (request/response)
- [ ] Implement FolderRepository (data access layer)
- [ ] Implement FolderService (business logic)
- [ ] Create API router for folders
- [ ] Implement GET /api/folders (get tree)
- [ ] Implement POST /api/folders (create)
- [ ] Implement PUT /api/folders/{id} (update)
- [ ] Implement DELETE /api/folders/{id} (delete)
- [ ] Implement POST /api/folders/{id}/move (move folder)
- [ ] Add input validation
- [ ] Add error handling
- [ ] Test all endpoints with sample data

**Acceptance Criteria**:
- All endpoints return correct status codes
- Folder tree builds correctly with nested folders
- Validation prevents invalid operations (e.g., circular parent)
- Delete cascades to children and prompts
- Move operation updates paths correctly
- API documentation auto-generated

**Dependencies**: S1-002

**Files to Create**:
- `backend/app/models/folder.py` - Pydantic models
- `backend/app/db/repositories/folder_repository.py` - Data access
- `backend/app/services/folder_service.py` - Business logic
- `backend/app/api/routers/folders.py` - API routes

---

#### S1-004: Prompt CRUD API
**Story Points**: 8
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create Pydantic models for Prompt (request/response)
- [ ] Implement PromptRepository (data access layer)
- [ ] Implement PromptService (business logic)
- [ ] Create API router for prompts
- [ ] Implement GET /api/prompts (list with folder filter)
- [ ] Implement GET /api/prompts/{id} (get single)
- [ ] Implement POST /api/prompts (create)
- [ ] Implement PUT /api/prompts/{id} (update)
- [ ] Implement DELETE /api/prompts/{id} (delete)
- [ ] Implement POST /api/prompts/{id}/move (move to folder)
- [ ] Implement POST /api/prompts/{id}/duplicate (duplicate)
- [ ] Add pagination support (limit/offset)
- [ ] Add input validation and error handling
- [ ] Test all endpoints

**Acceptance Criteria**:
- All CRUD operations work correctly
- Pagination returns correct results
- Duplicate creates copy with "(Copy)" suffix
- Move operation updates folder_id
- Validation prevents invalid data
- Error responses are consistent
- Version history tracked on updates

**Dependencies**: S1-002, S1-003

**Files to Create**:
- `backend/app/models/prompt.py` - Pydantic models
- `backend/app/db/repositories/prompt_repository.py` - Data access
- `backend/app/services/prompt_service.py` - Business logic
- `backend/app/api/routers/prompts.py` - API routes

---

#### S1-005: Error Handling and Validation
**Story Points**: 3
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Create custom exception classes
- [ ] Implement global exception handler
- [ ] Add validation middleware
- [ ] Standardize error response format
- [ ] Add logging configuration
- [ ] Test error scenarios

**Acceptance Criteria**:
- All errors return consistent format
- Appropriate HTTP status codes used
- Validation errors include field details
- Internal errors logged but sanitized for response
- 404, 400, 500 scenarios handled

**Dependencies**: S1-003, S1-004

**Files to Create**:
- `backend/app/core/exceptions.py` - Custom exceptions
- `backend/app/core/error_handlers.py` - Exception handlers
- `backend/app/core/logging.py` - Logging config

---

### 2. Frontend Infrastructure

#### S1-006: Electron + React Project Setup
**Story Points**: 3
**Priority**: Critical
**Assigned To**: TBD

**Tasks**:
- [ ] Initialize React app with TypeScript
- [ ] Install Electron
- [ ] Configure Electron main process
- [ ] Set up development build process
- [ ] Configure window management
- [ ] Install UI dependencies (React Router, Axios, etc.)
- [ ] Create basic app shell
- [ ] Test Electron app launches

**Acceptance Criteria**:
- App launches as Electron window
- React app renders inside Electron
- Hot reload works in development
- Window can be minimized/maximized/closed
- Development tools accessible (F12)

**Dependencies**: None

**Files to Create**:
- `frontend/package.json` - Dependencies
- `frontend/electron/main.js` - Electron main process
- `frontend/src/App.tsx` - Main React component
- `frontend/src/index.tsx` - React entry point

---

#### S1-007: API Service Layer
**Story Points**: 3
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Install and configure Axios
- [ ] Create API client base configuration
- [ ] Implement FolderAPI service
- [ ] Implement PromptAPI service
- [ ] Add request/response interceptors
- [ ] Add error handling
- [ ] Create TypeScript interfaces for API responses
- [ ] Test API calls

**Acceptance Criteria**:
- All backend endpoints accessible via type-safe methods
- Errors handled gracefully
- Loading states supported
- TypeScript types match backend models
- Easy to add new endpoints

**Dependencies**: S1-006, S1-003, S1-004

**Files to Create**:
- `frontend/src/services/api.ts` - Axios base config
- `frontend/src/services/folderApi.ts` - Folder endpoints
- `frontend/src/services/promptApi.ts` - Prompt endpoints
- `frontend/src/types/api.ts` - TypeScript types

---

#### S1-008: State Management Setup
**Story Points**: 3
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Choose state management solution (Context/Zustand)
- [ ] Create folder state store
- [ ] Create prompt state store
- [ ] Create UI state store
- [ ] Implement state actions (CRUD operations)
- [ ] Add persistence for UI preferences
- [ ] Test state updates

**Acceptance Criteria**:
- Global state accessible from any component
- State updates trigger re-renders
- Actions integrate with API service layer
- Type-safe state and actions
- Minimal boilerplate

**Dependencies**: S1-007

**Files to Create**:
- `frontend/src/store/folderStore.ts` - Folder state
- `frontend/src/store/promptStore.ts` - Prompt state
- `frontend/src/store/uiStore.ts` - UI state
- `frontend/src/store/index.ts` - Store exports

---

#### S1-009: Navigation Panel (Folder Tree)
**Story Points**: 8
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create NavigationPanel component
- [ ] Create FolderTree component
- [ ] Create FolderItem component (recursive)
- [ ] Implement tree data fetching
- [ ] Implement expand/collapse folders
- [ ] Add folder selection (highlight)
- [ ] Style folder tree
- [ ] Add loading state
- [ ] Add empty state
- [ ] Test with nested folders

**Acceptance Criteria**:
- Folder tree displays correctly
- Expand/collapse works smoothly
- Selected folder highlighted
- Icons for folders (closed/open)
- Responsive to window resize
- Handles deep nesting (scrollable)
- Loading spinner while fetching

**Dependencies**: S1-008

**Files to Create**:
- `frontend/src/components/NavigationPanel.tsx` - Left panel container
- `frontend/src/components/FolderTree.tsx` - Tree component
- `frontend/src/components/FolderItem.tsx` - Single folder item
- `frontend/src/components/NavigationPanel.module.css` - Styles

---

#### S1-010: Prompt Display Panel
**Story Points**: 8
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create PromptPanel component (right panel)
- [ ] Create PromptGrid component
- [ ] Create PromptCard component
- [ ] Fetch prompts for selected folder
- [ ] Display prompt cards in grid
- [ ] Add loading state
- [ ] Add empty state ("No prompts in this folder")
- [ ] Add hover effects
- [ ] Style prompt cards
- [ ] Test with multiple prompts

**Acceptance Criteria**:
- Prompts display in responsive grid
- Cards show title and preview of content
- Smooth hover effects
- Loading spinner while fetching
- Empty state with helpful message
- Updates when folder selection changes
- Truncate long content with ellipsis

**Dependencies**: S1-008

**Files to Create**:
- `frontend/src/components/PromptPanel.tsx` - Right panel container
- `frontend/src/components/PromptGrid.tsx` - Grid layout
- `frontend/src/components/PromptCard.tsx` - Single prompt card
- `frontend/src/components/PromptPanel.module.css` - Styles

---

#### S1-011: Prompt Card Hover Actions
**Story Points**: 5
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Add hover state to PromptCard
- [ ] Create action button components
- [ ] Implement Copy button (copy to clipboard)
- [ ] Implement Edit button (open modal)
- [ ] Implement Duplicate button (duplicate + open modal)
- [ ] Add toast notifications for actions
- [ ] Style action buttons
- [ ] Add keyboard shortcuts for actions
- [ ] Test all actions

**Acceptance Criteria**:
- Action buttons appear on hover
- Copy button copies content to clipboard
- Copy shows success notification
- Edit button opens edit modal
- Duplicate creates copy and opens editor
- Smooth animations
- Keyboard accessible

**Dependencies**: S1-010

**Files to Update**:
- `frontend/src/components/PromptCard.tsx` - Add action buttons
- `frontend/src/components/ActionButton.tsx` - Reusable button component

---

#### S1-012: Edit Modal
**Story Points**: 8
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create EditModal component
- [ ] Create form with title, content, tags fields
- [ ] Implement save functionality
- [ ] Implement cancel functionality
- [ ] Add form validation
- [ ] Add character count
- [ ] Add delete button
- [ ] Style modal
- [ ] Add keyboard shortcuts (Esc to close, Ctrl+S to save)
- [ ] Test create and edit scenarios

**Acceptance Criteria**:
- Modal opens centered on screen
- Form fields pre-populated when editing
- Validation prevents empty content
- Save updates prompt via API
- Cancel discards changes
- Delete prompts confirmation
- Keyboard shortcuts work
- Modal closes after save

**Dependencies**: S1-010

**Files to Create**:
- `frontend/src/components/EditModal.tsx` - Modal component
- `frontend/src/components/EditModal.module.css` - Styles

---

#### S1-013: Main Layout and Integration
**Story Points**: 3
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create MainLayout component
- [ ] Integrate NavigationPanel and PromptPanel
- [ ] Add resizable splitter between panels
- [ ] Add top menu bar (File, Edit, View, Help)
- [ ] Add status bar (optional)
- [ ] Style overall layout
- [ ] Test responsive behavior
- [ ] Ensure proper component communication

**Acceptance Criteria**:
- Two-panel layout works correctly
- Panels can be resized by dragging splitter
- Layout adapts to window resize
- Menu bar accessible
- Clean, professional appearance
- No layout shifting

**Dependencies**: S1-009, S1-010

**Files to Create**:
- `frontend/src/components/MainLayout.tsx` - Layout container
- `frontend/src/components/ResizableSplitter.tsx` - Panel divider
- `frontend/src/components/MenuBar.tsx` - Top menu

---

### 3. Testing and Documentation

#### S1-014: Backend Testing
**Story Points**: 5
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Set up pytest
- [ ] Write tests for folder repository
- [ ] Write tests for prompt repository
- [ ] Write tests for folder service
- [ ] Write tests for prompt service
- [ ] Write tests for folder API endpoints
- [ ] Write tests for prompt API endpoints
- [ ] Achieve 70%+ coverage

**Acceptance Criteria**:
- All tests pass
- Tests cover happy paths and error cases
- Test database isolated from development database
- Tests run quickly (under 10 seconds)
- Coverage report generated

**Dependencies**: S1-003, S1-004

**Files to Create**:
- `backend/tests/conftest.py` - Test configuration
- `backend/tests/test_folder_repository.py`
- `backend/tests/test_prompt_repository.py`
- `backend/tests/test_folder_service.py`
- `backend/tests/test_prompt_service.py`
- `backend/tests/test_folders_api.py`
- `backend/tests/test_prompts_api.py`

---

#### S1-015: README Updates
**Story Points**: 2
**Priority**: Low
**Assigned To**: TBD

**Tasks**:
- [ ] Update main README with setup instructions
- [ ] Update backend README
- [ ] Update frontend README
- [ ] Add screenshots (once UI is ready)
- [ ] Document environment variables
- [ ] Add troubleshooting section

**Acceptance Criteria**:
- Another developer can set up project from README
- All commands tested and working
- Screenshots show current state of app
- Prerequisites clearly listed

**Dependencies**: All other tasks

**Files to Update**:
- `prompt-manager/README.md`
- `backend/README.md`
- `frontend/README.md`

---

## Sprint Metrics

**Total Story Points**: 71
**Team Capacity**: TBD (depends on team size and availability)

**Velocity Projection**:
- Solo developer: ~20-30 points/sprint
- Small team (2-3): ~40-60 points/sprint

**Note**: This is an ambitious first sprint. Prioritize critical path items (S1-001 through S1-004 and S1-006 through S1-010) and defer medium/low priority items if needed.

---

## Definition of Done

A task is considered done when:
- [ ] Code implemented following coding standards
- [ ] Code reviewed (self-review minimum)
- [ ] Tests written and passing (where applicable)
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)
- [ ] Checked in both development mode
- [ ] Task marked complete in this file
- [ ] Entry added to COMPLETED.md

---

## Sprint Review Notes

**To be filled at end of sprint:**
- What was completed?
- What was not completed and why?
- Lessons learned
- Velocity actual vs. projected
- Adjustments for next sprint

---

## Daily Standups (Optional)

Use this section for quick daily updates:

**Day 1**:
- Completed:
- In Progress:
- Blockers:

**Day 2**:
- Completed:
- In Progress:
- Blockers:

*(Continue for each day of sprint)*
