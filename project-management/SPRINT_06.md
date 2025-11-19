# Sprint 6: Advanced Search

**Sprint Duration**: 1 day
**Sprint Goal**: Implement comprehensive advanced search functionality with filters, highlighting, real-time search, and context snippets.

**Start Date**: 2025-11-15
**End Date**: 2025-11-15
**Status**: 🔄 IN PROGRESS

---

## Problem Statement

**Current Issue**: The existing search only does basic text matching without advanced filtering, highlighting, or proper context display. Users need more powerful search capabilities to find prompts efficiently.

**Solution**: Enhance the search system with:
- Date range filtering
- Multi-field search (title, content, description, tags)
- Search result highlighting
- Real-time search as you type
- Context snippets showing matched text
- Better search relevance ranking

---

## Sprint Overview

**Story Points**: 5 total
- Phase 1: Backend Enhancements (2 points)
- Phase 2: Frontend UI Updates (2 points)
- Phase 3: Polish & Testing (1 point)

**Key Features**:
- 🔍 Enhanced search with date filtering
- 💡 Search result highlighting
- ⚡ Real-time search as you type
- 📝 Context snippets for matched text
- 📊 Better relevance ranking

---

## Phase 1: Backend Enhancements

### S6-001: Add Date Filtering to Search API ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: None

**Tasks**:
- [ ] Add `created_after` and `created_before` query parameters
- [ ] Update search service to filter by date range
- [ ] Add date filtering to SQL query
- [ ] Test date filtering with various ranges

**Implementation**:
```python
# In prompts.py router
@router.get("/search", response_model=PromptListResponse)
def search_prompts(
    q: str = Query(..., min_length=1),
    folder_id: Optional[int] = Query(None),
    tags: Optional[List[str]] = Query(None),
    created_after: Optional[str] = Query(None, description="ISO date: 2025-01-01"),
    created_before: Optional[str] = Query(None, description="ISO date: 2025-12-31"),
    limit: int = Query(50, ge=1, le=10000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    # ...
```

**Acceptance Criteria**:
- [ ] Date parameters accept ISO date strings
- [ ] Filter works with both dates, one date, or no dates
- [ ] Results respect date range filters

**Files to Modify**:
- `backend/app/api/routers/prompts.py`
- `backend/app/services/prompt_service.py`

---

### S6-002: Add Search Context Snippets ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: None

**Tasks**:
- [ ] Add snippet generation logic to search service
- [ ] Extract 100-200 chars around matched text
- [ ] Return snippets in search response
- [ ] Handle multiple matches in content

**Implementation**:
```python
def generate_snippet(content: str, query: str, max_length: int = 150) -> str:
    """Generate context snippet around matched query."""
    query_lower = query.lower()
    content_lower = content.lower()

    # Find first match
    pos = content_lower.find(query_lower)
    if pos == -1:
        return content[:max_length] + "..."

    # Extract context around match
    start = max(0, pos - 50)
    end = min(len(content), pos + len(query) + 100)

    snippet = content[start:end]
    if start > 0:
        snippet = "..." + snippet
    if end < len(content):
        snippet = snippet + "..."

    return snippet
```

**Acceptance Criteria**:
- [ ] Snippets show matched text with context
- [ ] Snippets are ~150 characters
- [ ] Multiple matches handled gracefully

**Files to Modify**:
- `backend/app/services/prompt_service.py`
- `backend/app/models/prompt.py` (add snippet field to response)

---

## Phase 2: Frontend UI Updates

### S6-003: Add Date Filter UI ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: S6-001

**Tasks**:
- [ ] Add date range inputs to SearchBar component
- [ ] Add filter toggle/dropdown UI
- [ ] Connect date filters to search API
- [ ] Add clear filters button

**Component Design**:
```tsx
interface SearchFilters {
  query: string;
  folderId?: number;
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
}

// SearchBar with advanced filters
<SearchBar
  onSearch={(filters) => handleSearch(filters)}
  showAdvancedFilters={true}
/>
```

**Acceptance Criteria**:
- [ ] Date pickers accessible and styled
- [ ] Filters persist during session
- [ ] Clear filters resets to default search

**Files to Create/Modify**:
- `frontend/src/components/SearchBar.tsx`
- `frontend/src/components/SearchBar.css`
- `frontend/src/components/SearchFilters.tsx` (NEW)
- `frontend/src/components/SearchFilters.css` (NEW)

---

### S6-004: Add Search Result Highlighting ⏳ PENDING
**Story Points**: 0.5
**Priority**: High
**Dependencies**: S6-002

**Tasks**:
- [ ] Create highlight utility function
- [ ] Highlight matched text in result titles
- [ ] Highlight matched text in snippets
- [ ] Use accent color for highlights

**Implementation**:
```tsx
function highlightText(text: string, query: string): JSX.Element {
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="search-highlight">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
```

**CSS**:
```css
.search-highlight {
  background-color: var(--accent-warning);
  opacity: 0.3;
  padding: 0.125rem 0.25rem;
  border-radius: 2px;
  font-weight: 600;
}
```

**Acceptance Criteria**:
- [ ] Matched text highlighted in yellow/orange
- [ ] Case-insensitive matching
- [ ] Works in both light and dark themes

**Files to Create/Modify**:
- `frontend/src/utils/highlight.tsx` (NEW)
- `frontend/src/components/SearchResults.tsx`
- `frontend/src/components/SearchResults.css`

---

### S6-005: Implement Real-Time Search ⏳ PENDING
**Story Points**: 0.5
**Priority**: Medium
**Dependencies**: None

**Tasks**:
- [ ] Add debounced search on input change
- [ ] Set debounce delay to 300ms
- [ ] Show loading indicator during search
- [ ] Cancel pending searches on new input

**Implementation**:
```tsx
const [searchQuery, setSearchQuery] = useState('');
const [isSearching, setIsSearching] = useState(false);

// Debounce search
const debouncedSearch = useMemo(
  () =>
    debounce((query: string, filters: SearchFilters) => {
      if (query.length >= 2) {
        setIsSearching(true);
        performSearch(query, filters).finally(() => setIsSearching(false));
      }
    }, 300),
  []
);

useEffect(() => {
  debouncedSearch(searchQuery, filters);
  return () => debouncedSearch.cancel();
}, [searchQuery, filters]);
```

**Acceptance Criteria**:
- [ ] Search triggers after 300ms of no typing
- [ ] Previous searches cancelled on new input
- [ ] Loading indicator shows during search
- [ ] Minimum 2 characters to trigger search

**Files to Modify**:
- `frontend/src/components/SearchBar.tsx`
- `frontend/src/hooks/useDebounce.ts` (NEW)

---

## Phase 3: Polish and Testing

### S6-006: Add Advanced Search UI Polish ⏳ PENDING
**Story Points**: 0.5
**Priority**: Medium
**Dependencies**: All previous tasks

**Tasks**:
- [ ] Add expand/collapse for advanced filters
- [ ] Add result count display
- [ ] Add "No results" empty state
- [ ] Add keyboard shortcuts (Cmd/Ctrl+K to focus search)
- [ ] Smooth animations for filter panel

**Acceptance Criteria**:
- [ ] Filters collapsible with smooth animation
- [ ] Result count updates in real-time
- [ ] Empty state is clear and helpful
- [ ] Keyboard shortcut works

**Files to Modify**:
- `frontend/src/components/SearchBar.tsx`
- `frontend/src/components/SearchResults.tsx`
- `frontend/src/App.tsx` (for keyboard shortcuts)

---

### S6-007: Testing and Documentation ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: All previous tasks

**Test Checklist**:
- [ ] Search by title works
- [ ] Search by content works
- [ ] Search by description works
- [ ] Search by tags works
- [ ] Date filtering works (before, after, range)
- [ ] Folder filtering works
- [ ] Tag filtering works
- [ ] Multiple filters combined work correctly
- [ ] Highlighting shows in results
- [ ] Real-time search triggers correctly
- [ ] Debouncing prevents excessive requests
- [ ] Context snippets show matched text
- [ ] Empty search shows all prompts
- [ ] No results state displays correctly

**Documentation Updates**:
- [ ] Update API_SPEC.md with new search parameters
- [ ] Update USER_GUIDE.md with search instructions
- [ ] Update README.md with advanced search feature
- [ ] Add to COMPLETED.md

**Files to Modify**:
- `docs/API_SPEC.md`
- `docs/USER_GUIDE.md`
- `README.md`
- `project-management/COMPLETED.md`

---

## Sprint Metrics

**Total Story Points**: 5
**Estimated Duration**: 3-4 hours
**Risk Level**: Low (mostly UI enhancements)

**Breakdown**:
- Phase 1 (Backend): 2 points
- Phase 2 (Frontend): 2 points
- Phase 3 (Polish): 1 point

---

## Definition of Done

- [ ] Date range filtering implemented and working
- [ ] Search highlights matched text in results
- [ ] Real-time search with debouncing works
- [ ] Context snippets show matched content
- [ ] Advanced filters UI is polished and intuitive
- [ ] All search combinations tested
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Works in both light and dark themes
- [ ] User tested and approved

---

## Technical Debt / Future Enhancements

- [ ] Add search history (recent searches)
- [ ] Save search filters as presets
- [ ] Add fuzzy/typo-tolerant search
- [ ] Add search suggestions/autocomplete
- [ ] Add full-text search ranking algorithm
- [ ] Export search results

---

**Status**: Ready to begin Sprint 6
**Next Action**: Start with S6-001 (Add Date Filtering to Search API)
