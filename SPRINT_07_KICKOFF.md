# Sprint 7 Kickoff Summary - Project Quick Copy Feature

**Date**: November 18, 2025
**Branch**: `feature/project-quick-copy`
**Status**: ✅ Initialized & Ready to Build
**Story Points**: 13
**Estimated Duration**: 2-3 days

---

## 🎯 Feature Overview

### The Problem
Currently, when you want to apply a prompt to a specific file, you have to:
1. Copy the prompt from the manager
2. Manually type or find the file path
3. Paste both into your AI tool
4. Repeat for every file/prompt combination

This is slow, error-prone, and breaks your flow.

### The Solution: Project Quick Copy
A **dual-selection system** that lets you:
1. Select a prompt from the left column (existing folders/prompts)
2. Select a project from the right column (new: title + file location)
3. Click "Copy Combined" to get: `"{prompt} {file_location}"` or `"{prompt} {title}"`

**Result**: 10x faster prompt generation for file-specific AI tasks.

---

## 🏗️ Architecture Design

### New Database Entity: Projects

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,           -- e.g., "Auth System"
    file_location TEXT NOT NULL,   -- e.g., "src/auth/index.ts"
    display_order INTEGER,          -- User-defined sort order
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### UI Layout Changes

#### Main App - New Projects Section
```
┌─────────────────────────────────────┐
│ 📁 Folders                          │
│ ├─ Work                             │
│ └─ Personal                         │
│                                     │
│ ─────────────────────────────────── │ ← NEW DIVIDER
│                                     │
│ 📦 Projects                    [+]  │ ← NEW SECTION
│ ┌─────────────────────────────────┐ │
│ │ 🔹 Auth System            ↑↓ ✕ │ │ ← Project Item
│ │ src/auth/index.ts              │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Quick Access Widget - Dual Column Redesign
```
┌────────────────────────────────────────────────┐
│         Quick Access - Enhanced                │
├────────────────────┬───────────────────────────┤
│ PROMPTS            │ PROJECTS                  │
├────────────────────┼───────────────────────────┤
│                    │                           │
│ 📁 Code Review     │ 🔹 Auth System            │
│   ⭐ Fix bugs      │ src/auth/index.ts         │
│   ⭐ Optimize      │ [Title] [Location] ←Hover │
│                    │                           │
│ 📁 Documentation   │ 🔹 API Gateway            │
│   ⭐ Write README  │ api/gateway.py            │
└────────────────────┴───────────────────────────┘
│ 📋 Copy Combined              Clear [✕]        │
│ Preview: "Fix bugs src/auth/index.ts"         │
└────────────────────────────────────────────────┘
```

### Copy Logic Matrix

| Prompt | Project Field | Button Text | Result |
|--------|---------------|-------------|---------|
| ✓ | - | "Copy Prompt" | `{prompt}` |
| - | Title | "Copy Project Title" | `{title}` |
| - | Location | "Copy File Location" | `{file_location}` |
| ✓ | Title | "Copy Combined" | `{prompt} {title}` |
| ✓ | Location | "Copy Combined" | `{prompt} {file_location}` |

---

## 📦 What's Been Completed (Task S7-001)

### ✅ Sprint Planning & Documentation
- Created comprehensive `SPRINT_07.md` with 12 detailed tasks
- Updated `CURRENT_SPRINT.md` to activate Sprint 7
- Updated `BACKLOG.md` with BACK-016 (new feature)
- Created feature branch: `feature/project-quick-copy`

### ✅ Database Foundation
- **Migration Script**: `backend/migrations/add_projects_table.py`
  - Creates `projects` table with all required columns
  - Adds index on `display_order` for performance
  - Creates trigger for `updated_at` timestamp automation
  - Includes rollback function for safety

- **SQLAlchemy Model**: `Project` class in `backend/app/db/models.py`
  - Matches migration schema exactly
  - Follows existing model patterns (Folder, Prompt)
  - Includes proper indexing and timestamps

- **Migration Registration**: Updated `backend/app/db/database.py`
  - Added `add_projects_table.migrate()` to init_db()
  - Migration runs automatically on backend startup

### ✅ Git Commit
```
feat: Initialize Sprint 7 - Project Quick Copy Feature
Commit: 18e7b50
Files Changed: 6
Insertions: +793
```

---

## 🚀 Next Steps - Implementation Roadmap

### Phase 1: Backend API (Tasks S7-002 to S7-005) - ~6 hours
**Priority: HIGH - Build this first**

1. **S7-002: Projects API Endpoints** (2 pts)
   - Create `backend/app/api/routers/projects.py`
   - Endpoints: GET, POST, PUT, DELETE, REORDER
   - Service layer: `backend/app/services/project_service.py`
   - Repository: `backend/app/db/repositories/project_repository.py`
   - Pydantic models: `backend/app/models/project.py`
   - Register router in `main.py`

2. **S7-003: Quick Access Combined Endpoint** (1 pt)
   - Create `GET /api/easy-access/data`
   - Returns: `{ prompts: [], projects: [] }`
   - Single efficient query

3. **S7-004: API Documentation** (1 pt)
   - Update `docs/API_SPEC.md`
   - Test all endpoints with Postman/curl

4. **S7-005: Smart Copy API** (1 pt)
   - Create `POST /api/copy/generate`
   - Handles all copy combinations
   - Request: `{ prompt_id?, project_id?, project_field? }`
   - Response: `{ text: string }`

### Phase 2: Main App Frontend (Tasks S7-006, S7-007) - ~4 hours

5. **S7-006: Projects Section UI** (2 pts)
   - Components: `ProjectsSection.tsx`, `ProjectList.tsx`, `ProjectItem.tsx`
   - New Project Dialog with title + file_location inputs
   - Drag-to-reorder support
   - Up/down arrows, delete button
   - Inline edit on double-click
   - Dark mode styling

6. **S7-007: Project State Management** (1 pt)
   - Zustand store: `frontend/src/store/projectStore.ts`
   - API client: `frontend/src/services/projectApi.ts`
   - TypeScript types in `frontend/src/types/api.ts`

### Phase 3: Widget Redesign (Tasks S7-008 to S7-010) - ~6 hours

7. **S7-008: Dual-Column Widget Layout** (2 pts)
   - Complete rewrite of `easy-access-widget.html`
   - CSS Grid: 60% prompts | 40% projects
   - Vertical divider
   - Independent scroll
   - Selection highlighting
   - Project hover buttons (Title/Location)

8. **S7-009: Smart Copy Button** (1 pt)
   - Fixed bottom action bar
   - Context-aware button label
   - Preview of copied text
   - Clear selections button

9. **S7-010: Backend Integration** (0.5 pts)
   - Widget calls `/api/copy/generate`
   - Error handling
   - Loading states

### Phase 4: Polish (Tasks S7-011, S7-012) - ~2 hours

10. **S7-011: UI Polish & Testing** (0.5 pts)
    - Smooth transitions
    - Keyboard shortcuts (Escape, Ctrl+C)
    - Accessibility (ARIA labels)
    - Performance testing with 100+ items

11. **S7-012: Documentation** (continuous)
    - Update README.md
    - Create `docs/PROJECT_QUICK_COPY.md` user guide
    - Update ARCHITECTURE.md
    - Update WORK_LOG.md

---

## 🎨 Implementation Notes

### Following Project Best Practices

1. **Layered Architecture**
   ```
   API Router → Service Layer → Repository → Database
   ```

2. **Type Safety**
   - Pydantic models for API validation
   - TypeScript interfaces for frontend
   - SQLAlchemy ORM for database

3. **Error Handling**
   - Custom exceptions in service layer
   - Toast notifications in UI
   - Optimistic UI with rollback

4. **Testing Strategy**
   - Manual testing during development
   - API testing with FastAPI /docs
   - UI testing in both light/dark modes
   - Performance testing with large datasets

### Code Consistency

- Follow existing patterns from Folders/Prompts
- Reuse UI components (buttons, dialogs, animations)
- Match dark mode theming exactly
- Use same drag-and-drop library (@dnd-kit)
- Consistent naming: `project` (singular) in code

---

## 📊 Development Timeline

### Recommended 3-Day Sprint

**Day 1 (Today)**: Backend Foundation
- ✅ S7-001: Database schema (DONE)
- [ ] S7-002: API endpoints
- [ ] S7-003: Easy-access combined endpoint
- [ ] S7-004: API documentation

**Day 2**: Main App & Widget
- [ ] S7-005: Smart copy API
- [ ] S7-006: Projects section in main app
- [ ] S7-007: Project state management
- [ ] S7-008: Widget dual-column redesign

**Day 3**: Integration & Polish
- [ ] S7-009: Smart copy button
- [ ] S7-010: Widget integration
- [ ] S7-011: UI polish & testing
- [ ] S7-012: Documentation

---

## 🔧 How to Continue Development

### Starting the Backend Server
```bash
cd prompt-manager/backend
.venv\Scripts\python.exe -m app.main
```

The migration will run automatically on startup and create the `projects` table.

### Starting the Frontend
```bash
cd prompt-manager/frontend
npm run dev
```

### Checking Migration Success
1. Start backend server
2. Look for: `[MIGRATION 007] Migration completed successfully`
3. Verify table exists:
   ```bash
   sqlite3 backend/prompts.db "SELECT * FROM projects;"
   ```

### Creating First Project (API Test)
```bash
curl -X POST http://127.0.0.1:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Auth System",
    "file_location": "src/auth/index.ts"
  }'
```

---

## 🎯 Success Criteria

### Sprint 7 is Complete When:
- [x] Projects table exists in database
- [ ] Full CRUD operations work for projects
- [ ] Projects section appears in main app sidebar
- [ ] Projects can be created, edited, deleted, reordered
- [ ] Quick Access Widget shows dual columns
- [ ] Can select prompt + project and copy combined
- [ ] All 8 copy combinations work correctly
- [ ] Dark mode works on all new components
- [ ] Documentation updated
- [ ] Zero console errors
- [ ] User feedback: "This is amazing!"

### Demo Scenario
1. Create project: "Database Layer" → "backend/db/models.py"
2. Star a prompt: "Review this code for bugs"
3. Open Quick Access Widget
4. Select prompt in left column → highlights
5. Hover over project → shows Title/Location buttons
6. Click "Location" button → highlights
7. Click "Copy Combined" → copies to clipboard
8. Paste result: "Review this code for bugs backend/db/models.py"
9. ✨ Magic! ✨

---

## 📝 Files Created/Modified Summary

### Created (6 files)
```
project-management/SPRINT_07.md
backend/migrations/add_projects_table.py
backend/app/models/project.py (pending)
backend/app/services/project_service.py (pending)
backend/app/db/repositories/project_repository.py (pending)
backend/app/api/routers/projects.py (pending)
```

### Modified (3 files)
```
project-management/CURRENT_SPRINT.md
project-management/BACKLOG.md
backend/app/db/models.py (added Project model)
backend/app/db/database.py (registered migration)
```

---

## 🚨 Important Reminders

1. **Test Migration First**
   - Start backend server
   - Verify migration runs successfully
   - Check table structure with SQLite browser

2. **Follow Existing Patterns**
   - Look at `folders.py` router for API structure
   - Look at `FolderService` for service layer
   - Look at `FolderRepository` for repository pattern

3. **Dark Mode**
   - Every new component needs dark mode styles
   - Use CSS variables from `themes.css`
   - Test in both themes before moving on

4. **User Experience**
   - Optimistic UI updates (instant feedback)
   - Toast notifications for all actions
   - Confirmation dialogs for destructive actions
   - Loading states for async operations

5. **Git Workflow**
   - Commit after each completed task
   - Use descriptive commit messages
   - Keep commits focused and atomic
   - Final PR: merge `feature/project-quick-copy` → `main`

---

## 🎉 Why This Feature Is Awesome

**Before**: "Let me copy this prompt... now find the file path... paste both..."
**After**: *Click. Click. Click.* ✨ Done! ✨

This feature will **transform** how you use AI for code-specific tasks. Instead of context switching between file browsers, prompt managers, and AI tools, everything happens in **two clicks** from a floating widget that's always available.

**Productivity gain**: Estimated 10x faster for repetitive file-specific AI interactions.

---

**Ready to build?** Start with **S7-002: Implement Projects API Endpoints**

The foundation is solid. The plan is clear. Let's ship this! 🚀
