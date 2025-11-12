# Sprint 2: Advanced Features & Claude Integration

**Sprint Duration**: 2 weeks
**Sprint Goal**: Implement drag-and-drop, Claude CLI integration for AI enhancement, search functionality, and UI polish.

**Start Date**: TBD (after Sprint 1 completion)
**End Date**: TBD

---

## Sprint Objectives

1. Implement drag-and-drop for folders and prompts
2. Integrate Claude CLI for prompt enhancement
3. Add search functionality
4. Implement version history UI
5. Polish UI/UX and error handling
6. Add settings panel

---

## Sprint Backlog

### 1. Drag and Drop

#### S2-001: Drag and Drop Infrastructure
**Story Points**: 5
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Install react-dnd or native HTML5 drag-drop
- [ ] Create draggable wrapper components
- [ ] Create drop zone components
- [ ] Implement drag preview
- [ ] Add drag state management
- [ ] Test basic drag and drop functionality

**Acceptance Criteria**:
- Items can be dragged
- Drop zones highlight on drag over
- Drag preview shows item being dragged
- Drag operations are smooth (60fps)
- Works with both mouse and touch

**Dependencies**: Sprint 1 completion

**Files to Create**:
- `frontend/src/components/Draggable.tsx` - Draggable wrapper
- `frontend/src/components/DropZone.tsx` - Drop target wrapper
- `frontend/src/hooks/useDragAndDrop.ts` - Drag logic hook

---

#### S2-002: Drag and Drop Prompts to Folders
**Story Points**: 5
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Make PromptCard draggable
- [ ] Make FolderItem a drop zone
- [ ] Implement onDrop handler
- [ ] Call move API endpoint
- [ ] Update UI optimistically
- [ ] Handle errors and rollback
- [ ] Add visual feedback (folder highlight)
- [ ] Test cross-folder moves

**Acceptance Criteria**:
- Prompts can be dragged to any folder
- Folder highlights when prompt dragged over it
- API called to persist move
- UI updates immediately (optimistic)
- Error shows notification and reverts
- Can't drop prompt on itself

**Dependencies**: S2-001

**Files to Update**:
- `frontend/src/components/PromptCard.tsx` - Make draggable
- `frontend/src/components/FolderItem.tsx` - Make drop zone
- `frontend/src/store/promptStore.ts` - Add move action

---

#### S2-003: Drag and Drop Folders
**Story Points**: 5
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Make FolderItem draggable
- [ ] Make FolderItem accept folder drops
- [ ] Implement move validation (no circular refs)
- [ ] Call folder move API endpoint
- [ ] Update folder tree
- [ ] Handle errors
- [ ] Add visual feedback
- [ ] Test folder nesting

**Acceptance Criteria**:
- Folders can be dragged to other folders
- Validation prevents circular references
- Folder tree updates correctly
- Paths recalculated for moved folder and children
- Visual feedback during drag
- Error handling for invalid moves

**Dependencies**: S2-001

**Files to Update**:
- `frontend/src/components/FolderItem.tsx` - Add drag/drop logic
- `frontend/src/store/folderStore.ts` - Add move validation

---

### 2. Claude CLI Integration

#### S2-004: Claude CLI Service Backend
**Story Points**: 8
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create ClaudeService class
- [ ] Implement subprocess execution for Claude CLI
- [ ] Create async job queue system
- [ ] Implement job status tracking (pending/processing/completed/failed)
- [ ] Store jobs in claude_jobs table
- [ ] Add timeout handling (5 minutes)
- [ ] Add retry logic for transient failures
- [ ] Create enhancement prompt template
- [ ] Test with actual Claude CLI

**Acceptance Criteria**:
- Can invoke Claude CLI programmatically
- Jobs run asynchronously (don't block API)
- Job status stored in database
- Timeout after 5 minutes
- Errors captured and logged
- Enhanced content stored in jobs table
- Multiple jobs can run concurrently (up to 3)

**Dependencies**: Sprint 1 completion

**Files to Create**:
- `backend/app/services/claude_service.py` - Claude integration
- `backend/app/services/job_queue.py` - Job management
- `backend/app/models/claude_job.py` - Pydantic models

---

#### S2-005: Claude API Endpoints
**Story Points**: 5
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create ClaudeRouter
- [ ] Implement POST /api/claude/rewrite endpoint
- [ ] Implement GET /api/claude/status/{job_id} endpoint
- [ ] Implement GET /api/claude/result/{job_id} endpoint
- [ ] Implement POST /api/claude/accept/{job_id} endpoint
- [ ] Add validation and error handling
- [ ] Test all endpoints
- [ ] Update API_SPEC.md

**Acceptance Criteria**:
- All endpoints documented and working
- Rewrite creates job and returns job_id
- Status endpoint returns current state
- Result endpoint returns enhanced content
- Accept endpoint updates prompt with enhancement
- Proper error handling for missing jobs

**Dependencies**: S2-004

**Files to Create**:
- `backend/app/api/routers/claude.py` - Claude endpoints
- `backend/app/db/repositories/claude_repository.py` - Job queries

---

#### S2-006: Claude Enhancement UI
**Story Points**: 8
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create EnhancementPanel component
- [ ] Add "Enhance with AI" button to EditModal
- [ ] Implement job submission
- [ ] Add polling for job status (every 2 seconds)
- [ ] Show loading state while processing
- [ ] Display enhanced version when ready
- [ ] Create side-by-side comparison view
- [ ] Add Accept/Reject buttons
- [ ] Add manual edit option
- [ ] Show error messages
- [ ] Add toast notifications
- [ ] Test full enhancement flow

**Acceptance Criteria**:
- Button triggers Claude enhancement
- Loading spinner shows while processing
- Enhanced version displays when ready
- Side-by-side comparison clear and readable
- Accept button updates prompt
- Reject button keeps original
- Manual edit available before accepting
- Errors shown with helpful messages
- Works for new and existing prompts

**Dependencies**: S2-005

**Files to Create**:
- `frontend/src/components/EnhancementPanel.tsx` - Enhancement UI
- `frontend/src/components/ComparisonView.tsx` - Side-by-side view
- `frontend/src/services/claudeApi.ts` - Claude API client
- `frontend/src/hooks/useClaudeEnhancement.ts` - Enhancement logic

---

#### S2-007: Auto-Enhancement on Create
**Story Points**: 3
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Add "Auto-enhance" checkbox to create prompt form
- [ ] Add setting to preferences for default behavior
- [ ] Automatically trigger enhancement on save if enabled
- [ ] Show notification when enhancement completes
- [ ] Add quick access to review enhancement
- [ ] Test auto-enhancement flow

**Acceptance Criteria**:
- Checkbox in create prompt form
- Setting persisted in preferences
- Enhancement triggered automatically when enabled
- Notification appears when ready
- Can review enhancement from notification
- Option to disable auto-enhancement

**Dependencies**: S2-006

**Files to Update**:
- `frontend/src/components/EditModal.tsx` - Add checkbox
- `frontend/src/store/uiStore.ts` - Store preference

---

### 3. Search and Filtering

#### S2-008: Search Backend
**Story Points**: 5
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Implement full-text search in PromptRepository
- [ ] Create SearchService with ranking algorithm
- [ ] Implement GET /api/search endpoint
- [ ] Add filters (folder, tags, date)
- [ ] Add result highlighting
- [ ] Optimize query performance
- [ ] Add search result limit/offset
- [ ] Test search with various queries

**Acceptance Criteria**:
- Searches both title and content
- Case-insensitive search
- Results ranked by relevance
- Filters work correctly
- Fast performance (<100ms for 1000 prompts)
- Returns snippets with highlighted matches
- Pagination supported

**Dependencies**: Sprint 1 completion

**Files to Create**:
- `backend/app/services/search_service.py` - Search logic
- `backend/app/api/routers/search.py` - Search endpoint

---

#### S2-009: Search UI
**Story Points**: 5
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Create SearchBar component
- [ ] Add search bar to top of app
- [ ] Implement real-time search (debounced)
- [ ] Create SearchResults component
- [ ] Display results in modal or panel
- [ ] Highlight search matches in results
- [ ] Add filters UI (folder, tags, date)
- [ ] Handle empty results
- [ ] Add keyboard navigation
- [ ] Test search UX

**Acceptance Criteria**:
- Search bar prominent and accessible
- Results appear as you type (debounced 300ms)
- Results show snippets with highlights
- Click result navigates to prompt
- Filters easy to use
- Keyboard shortcuts work (Ctrl+F to focus)
- Empty state helpful
- Fast and responsive

**Dependencies**: S2-008

**Files to Create**:
- `frontend/src/components/SearchBar.tsx` - Search input
- `frontend/src/components/SearchResults.tsx` - Results display
- `frontend/src/components/SearchFilters.tsx` - Filter controls
- `frontend/src/services/searchApi.ts` - Search API client

---

### 4. Version History

#### S2-010: Version History UI
**Story Points**: 5
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Add "History" tab to EditModal
- [ ] Fetch version history for prompt
- [ ] Display versions in chronological list
- [ ] Show version number, date, author
- [ ] Implement version preview
- [ ] Add "Restore" button for each version
- [ ] Implement restore functionality
- [ ] Add confirmation before restore
- [ ] Style version history list
- [ ] Test version restore

**Acceptance Criteria**:
- History tab shows all versions
- Versions sorted newest first
- Can preview any version
- Restore creates new version (doesn't delete history)
- Confirmation dialog before restore
- Visual diff between versions (stretch goal)

**Dependencies**: Sprint 1 completion (versions created in backend)

**Files to Create**:
- `frontend/src/components/VersionHistory.tsx` - History list
- `frontend/src/components/VersionPreview.tsx` - Version viewer

**Files to Update**:
- `frontend/src/components/EditModal.tsx` - Add history tab

---

### 5. UI Polish and Settings

#### S2-011: Error Handling and Notifications
**Story Points**: 3
**Priority**: High
**Assigned To**: TBD

**Tasks**:
- [ ] Install toast notification library (react-toastify)
- [ ] Create notification service
- [ ] Add success notifications (saved, copied, etc.)
- [ ] Add error notifications
- [ ] Add info notifications
- [ ] Standardize error messages
- [ ] Add retry buttons for failed operations
- [ ] Test various error scenarios

**Acceptance Criteria**:
- Notifications appear for all user actions
- Success messages are brief and positive
- Error messages are helpful and actionable
- Notifications auto-dismiss after 3-5 seconds
- Error notifications persist until dismissed
- Retry functionality works
- Notifications don't block UI

**Dependencies**: Sprint 1 completion

**Files to Create**:
- `frontend/src/services/notificationService.ts` - Notification helpers
- `frontend/src/components/Notification.tsx` - Custom notification component (if needed)

**Files to Update**:
- All components that trigger actions

---

#### S2-012: Settings Panel
**Story Points**: 5
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Create SettingsModal component
- [ ] Add settings menu item
- [ ] Implement general settings tab
- [ ] Add auto-enhancement toggle
- [ ] Add theme preference (light/dark - if implementing)
- [ ] Add Claude CLI path configuration
- [ ] Add database location display
- [ ] Implement settings persistence
- [ ] Add "Reset to defaults" button
- [ ] Style settings panel

**Acceptance Criteria**:
- Settings accessible from menu
- All settings persist across sessions
- Changes take effect immediately
- Clear organization by category
- Reset to defaults works correctly
- Helpful descriptions for each setting

**Dependencies**: Sprint 1 completion

**Files to Create**:
- `frontend/src/components/SettingsModal.tsx` - Settings UI
- `frontend/src/store/settingsStore.ts` - Settings state
- `frontend/src/services/settingsService.ts` - Persistence

---

#### S2-013: Keyboard Shortcuts
**Story Points**: 3
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Implement global keyboard shortcut handler
- [ ] Add Ctrl+N for new prompt
- [ ] Add Ctrl+F for search
- [ ] Add Ctrl+S for save (in edit modal)
- [ ] Add Esc to close modals
- [ ] Add Delete to delete selected prompt
- [ ] Add Ctrl+D to duplicate
- [ ] Add arrow keys for navigation
- [ ] Create keyboard shortcuts help (F1 or ?)
- [ ] Test all shortcuts

**Acceptance Criteria**:
- All shortcuts work consistently
- Shortcuts don't conflict with browser shortcuts
- Shortcuts disabled when typing in inputs
- Help panel shows all available shortcuts
- Shortcuts accessible and discoverable

**Dependencies**: Sprint 1 completion

**Files to Create**:
- `frontend/src/hooks/useKeyboardShortcuts.ts` - Shortcut logic
- `frontend/src/components/KeyboardShortcutsHelp.tsx` - Help panel

---

#### S2-014: UI Refinements
**Story Points**: 5
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Add loading skeletons for better perceived performance
- [ ] Improve animations and transitions
- [ ] Add empty states for all lists
- [ ] Improve mobile responsiveness (if applicable)
- [ ] Add tooltips for buttons
- [ ] Improve focus states for accessibility
- [ ] Add ARIA labels
- [ ] Test with screen reader
- [ ] Performance optimization (React.memo, useMemo)
- [ ] Fix any UI bugs from Sprint 1

**Acceptance Criteria**:
- App feels fast and responsive
- Loading states clear and pleasant
- Empty states helpful
- Accessible to keyboard users
- Tooltips provide context
- No layout shifts
- Smooth animations (60fps)
- Works at different window sizes

**Dependencies**: Sprint 1 completion

**Files to Update**:
- Various components for refinements

---

### 6. Testing and Documentation

#### S2-015: Integration Testing
**Story Points**: 5
**Priority**: Medium
**Assigned To**: TBD

**Tasks**:
- [ ] Set up Playwright for E2E testing
- [ ] Write test for creating prompt
- [ ] Write test for editing prompt
- [ ] Write test for deleting prompt
- [ ] Write test for drag and drop
- [ ] Write test for search
- [ ] Write test for Claude enhancement (mocked)
- [ ] Add CI/CD pipeline (GitHub Actions)
- [ ] Test on multiple platforms

**Acceptance Criteria**:
- E2E tests cover critical user flows
- Tests run automatically on commit
- Tests pass on Windows, macOS, Linux (if applicable)
- Test failures are clear and actionable
- Tests run in under 5 minutes

**Dependencies**: All feature tasks

**Files to Create**:
- `frontend/tests/e2e/create-prompt.spec.ts`
- `frontend/tests/e2e/edit-prompt.spec.ts`
- `frontend/tests/e2e/search.spec.ts`
- `.github/workflows/test.yml` - CI configuration

---

#### S2-016: Documentation Updates
**Story Points**: 2
**Priority**: Low
**Assigned To**: TBD

**Tasks**:
- [ ] Update USER_GUIDE.md with new features
- [ ] Update API_SPEC.md with Claude endpoints
- [ ] Add screenshots to README
- [ ] Create video walkthrough (optional)
- [ ] Update ARCHITECTURE.md if design changed
- [ ] Add troubleshooting for common issues

**Acceptance Criteria**:
- Documentation reflects all Sprint 2 features
- Screenshots are current and high quality
- Examples are accurate and tested
- New users can follow guide successfully

**Dependencies**: All feature tasks

**Files to Update**:
- `docs/USER_GUIDE.md`
- `docs/API_SPEC.md`
- `docs/ARCHITECTURE.md`
- `README.md`

---

## Sprint Metrics

**Total Story Points**: 76
**Team Capacity**: TBD (adjust based on Sprint 1 velocity)

**Critical Path**:
1. S2-004, S2-005, S2-006 (Claude integration)
2. S2-001, S2-002 (Drag and drop prompts)
3. S2-008, S2-009 (Search)

**Stretch Goals** (if time permits):
- S2-007 (Auto-enhancement)
- S2-010 (Version history UI)
- S2-013 (Keyboard shortcuts)

---

## Definition of Done

Same as Sprint 1:
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
- Demo notes

---

## Risks and Mitigations

**Risk**: Claude CLI integration more complex than expected
**Mitigation**: Allocate extra time for S2-004, consider simpler implementation for MVP

**Risk**: Drag and drop library issues
**Mitigation**: Test S2-001 early, have fallback plan (context menu for move)

**Risk**: Search performance issues with large libraries
**Mitigation**: Add database indexes, implement pagination early, test with large datasets

---

## Sprint Retrospective (End of Sprint)

**What went well:**
-

**What could be improved:**
-

**Action items for next sprint:**
-
