# Sprint 7: Project Quick Copy Feature

**Status**: 🔄 In Progress
**Branch**: `feature/project-quick-copy`
**Story Points**: 13
**Priority**: High
**Sprint Duration**: November 18-20, 2025

---

## 🎯 Sprint Goal

Implement a dual-selection Quick Copy system that combines prompts with project metadata (title/file location) for rapid context-aware prompt generation, dramatically increasing productivity for file-specific AI interactions.

---

## 📋 Feature Overview

### User Story
**As a** developer using AI assistance
**I want to** quickly combine generic prompts with specific project file paths
**So that** I can generate context-specific AI commands without manual copy-paste assembly

### Business Value
- **10x faster** prompt composition for file-specific tasks
- **Reduced errors** from manual path copying
- **Enhanced workflow** for repetitive AI interactions with different files
- **Scalable approach** for managing multiple active projects

---

## 🏗️ Architecture Changes

### New Database Entity: `projects`

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    file_location TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Component Structure

```
Main App Sidebar:
├── Folders Section (existing)
│   └── Folder Tree
├── [NEW DIVIDER]
└── Projects Section (new)
    ├── Section Header "Projects"
    ├── New Project Button
    └── Project List
        └── Project Items (title + file_location)

Quick Access Widget:
├── Left Column: Prompts (existing, from folders)
├── [VERTICAL DIVIDER]
├── Right Column: Projects (new)
└── Bottom Action Bar:
    └── Smart Copy Button (context-aware)
```

### Data Flow

```
Selection State:
{
  selectedPrompt: { id, content } | null,
  selectedProject: { id, title, file_location } | null,
  projectCopyMode: 'title' | 'location' | null
}

Copy Logic:
- Prompt only → Copy prompt content
- Project only → Copy selected field (title/location)
- Both selected → Copy "{prompt} {project_field}"
```

---

## 📝 Tasks Breakdown

### Backend Tasks (6 points)

#### S7-001: Create Projects Database Schema (1 pt)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: None

**Description**:
Create database migration script and SQLAlchemy model for `projects` table.

**Acceptance Criteria**:
- [ ] Migration script in `backend/migrations/add_projects_table.py`
- [ ] SQLAlchemy model in `backend/app/db/models.py`
- [ ] Migration runs successfully on app startup
- [ ] Table includes: id, title, file_location, display_order, timestamps
- [ ] Indexes on display_order for sorting performance

**Files to Create/Modify**:
- `backend/migrations/add_projects_table.py` (NEW)
- `backend/app/db/models.py` (MODIFY - add Project model)

---

#### S7-002: Implement Projects API Endpoints (2 pts)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-001

**Description**:
Create full CRUD API for projects with reordering support.

**Acceptance Criteria**:
- [ ] `GET /api/projects` - List all projects (ordered by display_order)
- [ ] `GET /api/projects/{id}` - Get single project
- [ ] `POST /api/projects` - Create new project (title, file_location)
- [ ] `PUT /api/projects/{id}` - Update project
- [ ] `DELETE /api/projects/{id}` - Delete project
- [ ] `POST /api/projects/reorder` - Reorder projects
- [ ] Pydantic models for request/response validation
- [ ] Repository pattern for data access
- [ ] Service layer for business logic

**Files to Create/Modify**:
- `backend/app/api/routers/projects.py` (NEW)
- `backend/app/services/project_service.py` (NEW)
- `backend/app/db/repositories/project_repository.py` (NEW)
- `backend/app/models/project.py` (NEW)
- `backend/app/main.py` (MODIFY - register router)

---

#### S7-003: Add Projects to Quick Access API (1 pt)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-002

**Description**:
Extend easy-access API to return projects alongside prompts.

**Acceptance Criteria**:
- [ ] `GET /api/easy-access/data` returns both prompts and projects
- [ ] Response structure: `{ prompts: [], projects: [] }`
- [ ] Projects sorted by display_order
- [ ] Efficient single-query fetch for performance

**Files to Create/Modify**:
- `backend/app/api/routers/easy_access.py` (MODIFY)

---

#### S7-004: API Documentation & Testing (1 pt)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-002, S7-003

**Description**:
Document new endpoints and verify functionality.

**Acceptance Criteria**:
- [ ] All endpoints documented in `docs/API_SPEC.md`
- [ ] OpenAPI schema updated (visible at /docs)
- [ ] Manual testing of all CRUD operations
- [ ] Test reordering functionality
- [ ] Verify easy-access combined endpoint

**Files to Create/Modify**:
- `docs/API_SPEC.md` (MODIFY)

---

#### S7-005: Implement Smart Copy Logic (1 pt)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-003

**Description**:
Create backend endpoint for intelligent copy text generation.

**Acceptance Criteria**:
- [ ] `POST /api/copy/generate` endpoint
- [ ] Request body: `{ prompt_id?, project_id?, project_field?: 'title'|'location' }`
- [ ] Response: `{ text: string }`
- [ ] Logic handles all combinations:
  - Prompt only → prompt content
  - Project-title only → project title
  - Project-location only → file location
  - Prompt + Project → "{prompt} {project_field}"
- [ ] Empty selection returns empty string

**Files to Create/Modify**:
- `backend/app/api/routers/copy.py` (NEW)
- `backend/app/services/copy_service.py` (NEW)

---

### Frontend Tasks (7 points)

#### S7-006: Create Projects Section in Main App Sidebar (2 pts)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-002

**Description**:
Add new "Projects" section below folders in main app sidebar.

**Acceptance Criteria**:
- [ ] Visual divider between Folders and Projects sections
- [ ] Section header "Projects" with icon
- [ ] "New Project" button (+ icon)
- [ ] Project list displays all projects
- [ ] Each project shows title (primary) and file_location (secondary/muted)
- [ ] Hover reveals up/down reorder arrows
- [ ] Click project to highlight (selection state)
- [ ] Delete button on hover (with confirmation)
- [ ] Inline edit on double-click
- [ ] Drag-to-reorder support
- [ ] Dark mode compatible styling

**Files to Create/Modify**:
- `frontend/src/components/ProjectsSection.tsx` (NEW)
- `frontend/src/components/ProjectList.tsx` (NEW)
- `frontend/src/components/ProjectItem.tsx` (NEW)
- `frontend/src/components/NewProjectDialog.tsx` (NEW)
- `frontend/src/pages/Home.tsx` (MODIFY - add section)
- `frontend/src/components/Sidebar.tsx` (MODIFY - layout)

---

#### S7-007: Create Project State Management (1 pt)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-002

**Description**:
Implement Zustand store for projects with CRUD operations.

**Acceptance Criteria**:
- [ ] `projectStore.ts` with state management
- [ ] Actions: loadProjects, createProject, updateProject, deleteProject, reorderProject
- [ ] API service layer: `projectApi.ts`
- [ ] TypeScript types: Project interface
- [ ] Error handling with toast notifications
- [ ] Loading states

**Files to Create/Modify**:
- `frontend/src/store/projectStore.ts` (NEW)
- `frontend/src/services/projectApi.ts` (NEW)
- `frontend/src/types/api.ts` (MODIFY - add Project type)

---

#### S7-008: Redesign Quick Access Widget - Two Column Layout (2 pts)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-003, S7-007

**Description**:
Transform Quick Access Widget into dual-column selection interface.

**Acceptance Criteria**:
- [ ] Left column: Prompts (existing folders + prompts)
- [ ] Right column: Projects (new)
- [ ] Vertical divider between columns
- [ ] Each column independently scrollable
- [ ] Selection state persists until cleared
- [ ] Visual highlight for selected items (border/background)
- [ ] Project items show both title and location
- [ ] Hover on project shows two buttons:
  - "Title" button (selects title for copy)
  - "Location" button (selects location for copy)
- [ ] Selected button stays highlighted
- [ ] Clicking different button switches selection
- [ ] Width: 60% prompts / 40% projects
- [ ] Responsive layout (minimum 800px width)

**Files to Create/Modify**:
- `frontend/public/easy-access-widget.html` (MAJOR REWRITE)

---

#### S7-009: Implement Smart Copy Button (1 pt)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-005, S7-008

**Description**:
Add bottom action bar with context-aware copy button.

**Acceptance Criteria**:
- [ ] Fixed bottom bar spanning full widget width
- [ ] "Copy" button always enabled (not grayed out)
- [ ] Button label changes based on selection:
  - No selection: "Copy" (does nothing)
  - Prompt only: "Copy Prompt"
  - Project-title only: "Copy Project Title"
  - Project-location only: "Copy File Location"
  - Prompt + Project: "Copy Combined"
- [ ] Click triggers copy to clipboard
- [ ] Toast notification on successful copy
- [ ] Shows preview of copied text (truncated to 50 chars)
- [ ] Clear selections button (X icon) when anything selected

**Files to Create/Modify**:
- `frontend/public/easy-access-widget.html` (MODIFY)

---

#### S7-010: Widget-to-Backend Integration (0.5 pts)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-009

**Description**:
Connect widget to smart copy API endpoint.

**Acceptance Criteria**:
- [ ] Widget calls `POST /api/copy/generate` on copy click
- [ ] Passes correct prompt_id, project_id, project_field
- [ ] Handles API errors gracefully
- [ ] Falls back to client-side concatenation if API fails
- [ ] Loading state during API call (button shows spinner)

**Files to Create/Modify**:
- `frontend/public/easy-access-widget.html` (MODIFY)

---

#### S7-011: UI Polish & Testing (0.5 pts)
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: S7-006, S7-008, S7-009, S7-010

**Description**:
Refinement, visual polish, and comprehensive testing.

**Acceptance Criteria**:
- [ ] Smooth transitions for selections (0.2s ease)
- [ ] Hover states on all interactive elements
- [ ] Keyboard shortcuts:
  - Escape: Clear selections
  - Ctrl+C: Copy (when something selected)
- [ ] Accessibility: ARIA labels, keyboard navigation
- [ ] Responsive behavior tested at multiple widget sizes
- [ ] Dark mode consistency check
- [ ] All toast messages have appropriate icons
- [ ] Test all selection combinations (8 scenarios)
- [ ] Performance check: No lag with 100+ prompts + projects

**Files to Modify**:
- All frontend files from previous tasks

---

### Documentation Tasks (0 points - continuous)

#### S7-012: Update Documentation
**Owner**: AI Agent
**Status**: ⏳ Not Started
**Depends On**: All tasks

**Description**:
Comprehensive documentation updates for new feature.

**Acceptance Criteria**:
- [ ] Update `README.md` with Project Quick Copy feature
- [ ] Create `docs/PROJECT_QUICK_COPY.md` user guide
- [ ] Update `docs/ARCHITECTURE.md` with Projects entity
- [ ] Update `docs/API_SPEC.md` with new endpoints
- [ ] Update `QUICK_ACCESS_WIDGET.md` with dual-column design
- [ ] Add screenshots/diagrams to documentation
- [ ] Update `WORK_LOG.md` with sprint summary

**Files to Create/Modify**:
- `README.md`
- `docs/PROJECT_QUICK_COPY.md` (NEW)
- `docs/ARCHITECTURE.md`
- `docs/API_SPEC.md`
- `QUICK_ACCESS_WIDGET.md`
- `project-management/WORK_LOG.md`

---

## 🎨 UI/UX Design Specifications

### Main App Sidebar - Projects Section

```
┌─────────────────────────────────────┐
│ 📁 Folders                          │
│ ├─ 📁 Work                          │
│ │  └─ 📁 Development                │
│ └─ 📁 Personal                      │
│                                     │
│ ─────────────────────────────────── │ ← Divider
│                                     │
│ 📦 Projects                    [+]  │ ← Header + New Button
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔹 Auth System            ↑ ↓ ✕│ │ ← Project Item (hover)
│ │ src/auth/index.ts              │ │
│ │                                 │ │
│ │ 🔹 Database Layer               │ │
│ │ backend/db/models.py            │ │
│ │                                 │ │
│ │ 🔹 Frontend Router              │ │
│ │ frontend/src/router.tsx         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Quick Access Widget - Dual Column Layout

```
┌────────────────────────────────────────────────────────────────┐
│                    Quick Access - Enhanced                     │
├──────────────────────────────────┬─────────────────────────────┤
│ PROMPTS                          │ PROJECTS                    │
├──────────────────────────────────┼─────────────────────────────┤
│                                  │                             │
│ 📁 Code Review                   │ 🔹 Auth System              │
│   ⭐ Fix TypeScript errors       │ src/auth/index.ts           │
│   ⭐ Optimize performance        │ [Title][Location] ← Buttons │
│                                  │                             │
│ 📁 Documentation                 │ 🔹 API Gateway              │
│   ⭐ Write README                │ api/gateway.py              │
│                                  │                             │
│ 📁 Testing                       │ 🔹 User Service             │
│   ⭐ Create unit tests           │ services/user.ts            │
│                                  │                             │
│ [Selected: highlighted]          │ [Selected: highlighted]     │
│                                  │                             │
└──────────────────────────────────┴─────────────────────────────┘
│ 📋 Copy Combined                           Clear [✕]           │
│ Preview: "Fix TypeScript errors src/auth/index.ts"            │
└────────────────────────────────────────────────────────────────┘
```

### Copy Button States

| Selection | Button Text | Action |
|-----------|-------------|--------|
| None | "Copy" | No-op (or show tooltip) |
| Prompt only | "Copy Prompt" | Copy prompt content |
| Project (Title) | "Copy Project Title" | Copy project title |
| Project (Location) | "Copy File Location" | Copy file path |
| Prompt + Project | "Copy Combined" | Copy "{prompt} {project}" |

---

## 🧪 Testing Strategy

### Manual Test Cases

#### Main App - Projects Section
1. **Create Project**: Add new project with title + file location
2. **Edit Project**: Double-click to inline edit
3. **Delete Project**: Confirm deletion dialog works
4. **Reorder Projects**: Drag or use arrows to reorder
5. **Persistence**: Refresh page, verify order/data persists
6. **Dark Mode**: Toggle theme, verify styling

#### Quick Access Widget
1. **Load Data**: Verify prompts and projects load correctly
2. **Select Prompt**: Click prompt, verify highlight
3. **Select Project (Title)**: Click Title button, verify highlight
4. **Select Project (Location)**: Click Location button, verify highlight
5. **Toggle Selection**: Click different buttons, verify switch
6. **Copy Prompt Only**: Select prompt, copy, verify clipboard
7. **Copy Project Only**: Select project field, copy, verify clipboard
8. **Copy Combined**: Select both, copy, verify format "{prompt} {project}"
9. **Clear Selections**: Click Clear button, verify reset
10. **Multi-selection Edge Cases**: Rapid clicking, verify state consistency

### Integration Tests
- Backend API endpoints respond correctly
- Frontend stores sync with backend
- Widget receives data from combined endpoint
- Copy API generates correct text for all combinations

### Performance Tests
- Widget loads <500ms with 100 prompts + 50 projects
- Reordering updates immediately (optimistic UI)
- No memory leaks on repeated selections

---

## 🚀 Deployment Plan

### Phase 1: Backend (Tasks S7-001 to S7-005)
1. Create migration, test database schema
2. Implement API endpoints, test with Postman/curl
3. Deploy backend changes (restart server)

### Phase 2: Main App Frontend (Tasks S7-006, S7-007)
1. Build Projects section UI
2. Integrate with backend APIs
3. Test CRUD operations in main app

### Phase 3: Widget Redesign (Tasks S7-008 to S7-010)
1. Rebuild widget with dual-column layout
2. Implement selection state management
3. Integrate smart copy functionality
4. Test all copy combinations

### Phase 4: Polish & Documentation (Tasks S7-011, S7-012)
1. UI/UX refinements
2. Comprehensive testing
3. Documentation updates
4. User feedback session

---

## 📊 Success Metrics

### Feature Adoption
- Projects created in first week: 10+
- Quick Copy usage: 50+ copies per day
- User feedback: "This saves me so much time!"

### Performance
- Copy action completes in <100ms
- Widget remains responsive with 100+ items
- Zero console errors during normal usage

### Code Quality
- All TypeScript types defined
- No ESLint warnings
- Backend follows repository pattern
- API documented in OpenAPI schema

---

## 🔄 Future Enhancements (Backlog)

- **Project Templates**: Common project structures (frontend, backend, fullstack)
- **Recent Projects**: Show 5 most recently used projects
- **Project Tags**: Categorize projects (e.g., "Active", "Archive")
- **File Browser**: Browse/select file location instead of typing
- **Multi-file Projects**: Support multiple files per project
- **Custom Copy Formats**: User-defined templates (e.g., "File: {location}\n\n{prompt}")
- **Keyboard Shortcuts**: Quick-select projects with numbers (1-9)
- **Project Search**: Filter projects by title/location

---

## 🎯 Definition of Done

- [ ] All 12 tasks completed and tested
- [ ] Code merged to `main` branch
- [ ] Documentation updated and reviewed
- [ ] User guide created with examples
- [ ] Feature demonstrated to stakeholders
- [ ] No critical bugs or performance issues
- [ ] Backward compatible (existing features unaffected)
- [ ] Migration script tested on fresh database
- [ ] Dark mode verified across all new components
- [ ] Keyboard accessibility verified

---

## 📅 Timeline

**Day 1 (Nov 18)**:
- S7-001: Database schema ✓
- S7-002: API endpoints
- S7-003: Easy-access API update

**Day 2 (Nov 19)**:
- S7-006: Main app Projects section
- S7-007: Project state management
- S7-008: Widget redesign (dual-column)

**Day 3 (Nov 20)**:
- S7-009: Smart copy button
- S7-010: Integration
- S7-011: Polish & testing
- S7-012: Documentation

---

**Sprint Owner**: AI Agent
**Stakeholder**: User (Product Owner)
**Review Date**: November 20, 2025
**Retrospective**: After sprint completion
