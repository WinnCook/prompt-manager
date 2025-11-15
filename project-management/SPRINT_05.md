# Sprint 5: Dark Mode Theme

**Sprint Duration**: 1 day
**Sprint Goal**: Implement a complete dark mode theme with toggle, persistence, and system theme detection, improving user experience for users who prefer dark interfaces.

**Start Date**: 2025-01-15
**End Date**: 2025-01-15
**Status**: 🔄 IN PROGRESS

---

## Problem Statement

**Current Issue**: The application only has a light theme, which can cause eye strain for users who prefer dark interfaces or work in low-light environments.

**Solution**: Implement a complete dark mode with:
- Theme toggle in the header
- Automatic system theme detection
- Persistent user preference
- Smooth theme transitions
- All components styled for both themes

---

## Sprint Overview

**Story Points**: 13 total
- Phase 1: Design & Planning (2 points)
- Phase 2: Core Implementation (5 points)
- Phase 3: Component Styling (4 points)
- Phase 4: Polish & Testing (2 points)

**Key Features**:
- ✨ Dark theme color palette
- 🌗 Theme toggle button in header
- 💾 Persist theme preference to localStorage
- 🖥️ Auto-detect system theme preference
- 🎨 Smooth theme transition animations
- 🎯 All components styled for both light and dark themes

---

## Phase 1: Design and Planning

### S5-001: Design Dark Mode Color Palette ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: None

**Tasks**:
- [ ] Define dark mode color variables
- [ ] Ensure proper contrast ratios (WCAG AA compliance)
- [ ] Test colors for readability
- [ ] Document color usage guidelines

**Color Palette Design**:

**Dark Theme Colors**:
```css
/* Backgrounds */
--bg-primary-dark: #1e1e1e;      /* Main background */
--bg-secondary-dark: #2d2d2d;    /* Sidebar, cards */
--bg-tertiary-dark: #3a3a3a;     /* Hover states */

/* Text */
--text-primary-dark: #e0e0e0;    /* Main text */
--text-secondary-dark: #b0b0b0;  /* Secondary text */
--text-muted-dark: #808080;      /* Muted text */

/* Borders */
--border-primary-dark: #404040;  /* Main borders */
--border-secondary-dark: #333333; /* Subtle borders */

/* Accents */
--accent-primary-dark: #4a9eff;  /* Blue accent (lighter) */
--accent-success-dark: #4caf50;  /* Green */
--accent-warning-dark: #ff9800;  /* Orange */
--accent-danger-dark: #f44336;   /* Red */

/* Shadows */
--shadow-sm-dark: 0 1px 3px rgba(0, 0, 0, 0.5);
--shadow-md-dark: 0 4px 6px rgba(0, 0, 0, 0.5);
--shadow-lg-dark: 0 10px 15px rgba(0, 0, 0, 0.5);
```

**Light Theme Colors** (existing):
```css
/* Keep current colors, just organize them */
--bg-primary-light: #ffffff;
--bg-secondary-light: #ecf0f1;
--text-primary-light: #2c3e50;
--accent-primary-light: #2196f3;
/* etc. */
```

**Acceptance Criteria**:
- [ ] All colors have sufficient contrast (4.5:1 for text)
- [ ] Colors tested in actual components
- [ ] Color variables documented in CSS

**Files to Create/Modify**:
- `frontend/src/styles/themes.css` (NEW)

---

### S5-002: Plan Theme Architecture ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: None

**Tasks**:
- [ ] Decide on theme implementation approach
- [ ] Plan state management for theme
- [ ] Design theme toggle UI/UX
- [ ] Plan CSS variable structure

**Architecture Decisions**:

**1. Implementation Approach**: CSS Variables + Data Attribute
- Use `[data-theme="dark"]` attribute on `<html>` element
- Define all colors as CSS variables
- Toggle theme by changing data attribute
- Simple, performant, no flash on load

**2. State Management**:
```typescript
// Add to uiStore.ts
interface UIState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

**3. Theme Detection**:
```typescript
// Detect system theme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Listen for system theme changes
prefersDark.addEventListener('change', (e) => {
  if (theme === 'system') {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});
```

**4. Toggle UI Design**:
- Location: Header, next to SearchBar
- Icon: 🌙 (moon) for light mode, ☀️ (sun) for dark mode
- Dropdown with 3 options: Light, Dark, System
- Current selection indicated with checkmark

**Acceptance Criteria**:
- [ ] Architecture documented
- [ ] Implementation approach decided
- [ ] CSS variable structure planned

---

## Phase 2: Core Implementation

### S5-003: Create Theme CSS Variables ⏳ PENDING
**Story Points**: 2
**Priority**: High
**Dependencies**: S5-001, S5-002

**Tasks**:
- [ ] Create `themes.css` with all color variables
- [ ] Define light theme variables (default)
- [ ] Define dark theme variables under `[data-theme="dark"]`
- [ ] Import themes.css in App
- [ ] Test variable switching

**Implementation**:
```css
/* themes.css */
:root {
  /* Light theme (default) */
  --bg-primary: #ffffff;
  --bg-secondary: #ecf0f1;
  --bg-tertiary: #dfe4e6;
  --text-primary: #2c3e50;
  --text-secondary: #34495e;
  --text-muted: #7f8c8d;
  --border-primary: #bdc3c7;
  --border-secondary: #ecf0f1;
  --accent-primary: #2196f3;
  --accent-success: #27ae60;
  --accent-warning: #f39c12;
  --accent-danger: #e74c3c;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  /* Dark theme */
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3a3a3a;
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-muted: #808080;
  --border-primary: #404040;
  --border-secondary: #333333;
  --accent-primary: #4a9eff;
  --accent-success: #4caf50;
  --accent-warning: #ff9800;
  --accent-danger: #f44336;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
}
```

**Acceptance Criteria**:
- [ ] All color variables defined for both themes
- [ ] Variables properly scoped
- [ ] No hardcoded colors in CSS

**Files to Create**:
- `frontend/src/styles/themes.css`

---

### S5-004: Add Theme State to UI Store ⏳ PENDING
**Story Points**: 2
**Priority**: High
**Dependencies**: S5-002

**Tasks**:
- [ ] Add theme state to uiStore
- [ ] Add setTheme action
- [ ] Add getEffectiveTheme helper (resolves 'system' to 'light'/'dark')
- [ ] Persist theme to localStorage
- [ ] Initialize theme from localStorage or system preference

**Implementation**:
```typescript
// uiStore.ts
interface UIState {
  // ... existing state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

// In create function:
theme: 'system',

setTheme: (theme) => {
  set({ theme });
  // Apply theme to DOM
  const effectiveTheme = theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme;
  document.documentElement.setAttribute('data-theme', effectiveTheme);
},

getEffectiveTheme: () => {
  const state = get();
  if (state.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return state.theme;
},

// Persist to localStorage
partialize: (state) => ({
  // ... existing persisted state
  theme: state.theme,
}),
```

**Acceptance Criteria**:
- [ ] Theme state persists across page reloads
- [ ] System theme changes detected and applied
- [ ] DOM data-theme attribute updates correctly

**Files to Modify**:
- `frontend/src/store/uiStore.ts`

---

### S5-005: Create Theme Toggle Component ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: S5-004

**Tasks**:
- [ ] Create ThemeToggle component
- [ ] Add dropdown with Light/Dark/System options
- [ ] Show current theme with icon
- [ ] Integrate with uiStore
- [ ] Add styles

**Component Interface**:
```typescript
// ThemeToggle.tsx
export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className="theme-toggle">
      <button onClick={() => setIsOpen(!isOpen)}>
        {themeOptions.find(t => t.value === theme)?.icon}
      </button>
      {isOpen && (
        <div className="theme-dropdown">
          {themeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className={theme === option.value ? 'active' : ''}
            >
              {option.icon} {option.label}
              {theme === option.value && ' ✓'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria**:
- [ ] Toggle button shows current theme icon
- [ ] Dropdown shows all three options
- [ ] Current selection indicated with checkmark
- [ ] Clicking option changes theme immediately

**Files to Create**:
- `frontend/src/components/ThemeToggle.tsx`
- `frontend/src/components/ThemeToggle.css`

**Files to Modify**:
- `frontend/src/components/index.ts`

---

## Phase 3: Component Styling

### S5-006: Convert App.css to Use CSS Variables ⏳ PENDING
**Story Points**: 2
**Priority**: High
**Dependencies**: S5-003

**Tasks**:
- [ ] Replace all hardcoded colors with CSS variables
- [ ] Update background colors
- [ ] Update text colors
- [ ] Update border colors
- [ ] Test in both light and dark modes

**Example Conversion**:
```css
/* Before */
.sidebar {
  background-color: #ecf0f1;
  border-right: 1px solid #bdc3c7;
  color: #2c3e50;
}

/* After */
.sidebar {
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  color: var(--text-primary);
}
```

**Acceptance Criteria**:
- [ ] No hardcoded colors in App.css
- [ ] All colors use CSS variables
- [ ] App looks correct in both themes

**Files to Modify**:
- `frontend/src/App.css`

---

### S5-007: Convert Component Styles to Use CSS Variables ⏳ PENDING
**Story Points**: 2
**Priority**: High
**Dependencies**: S5-003

**Tasks**:
- [ ] Convert PromptCard.css
- [ ] Convert PromptListItem.css
- [ ] Convert FolderTree.css
- [ ] Convert EditModal.css
- [ ] Convert SearchBar.css
- [ ] Convert all other component CSS files
- [ ] Test each component in both themes

**Components to Update**:
1. PromptCard.css
2. PromptListItem.css
3. FolderTree.css
4. EditModal.css
5. SearchBar.css
6. ResizableDivider.css
7. ViewToggle.css (if exists)
8. CommandPalette.css
9. ShortcutsHelp.css
10. Any other component CSS files

**Acceptance Criteria**:
- [ ] All component CSS files use variables
- [ ] All components look good in both themes
- [ ] No visual bugs in dark mode

**Files to Modify**:
- `frontend/src/components/*.css` (all CSS files)

---

## Phase 4: Polish and Testing

### S5-008: Add Theme Transition Animation ⏳ PENDING
**Story Points**: 1
**Priority**: Medium
**Dependencies**: S5-003, S5-006, S5-007

**Tasks**:
- [ ] Add smooth transition for theme changes
- [ ] Ensure transition doesn't affect other animations
- [ ] Test performance

**Implementation**:
```css
/* themes.css */
:root {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Apply to all elements that change color */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

**Acceptance Criteria**:
- [ ] Smooth transition when switching themes
- [ ] No jank or flash
- [ ] Existing animations not affected

---

### S5-009: Add Theme Toggle to App Header ⏳ PENDING
**Story Points**: 1
**Priority**: High
**Dependencies**: S5-005

**Tasks**:
- [ ] Add ThemeToggle to App header
- [ ] Position next to SearchBar
- [ ] Ensure responsive layout
- [ ] Test on different screen sizes

**Implementation**:
```tsx
// App.tsx header section
<header className="app-header">
  <div className="header-content">
    <h1>Prompt Manager</h1>
    <div className="header-actions">
      <SearchBar onSearch={handleSearch} />
      <ThemeToggle />
    </div>
  </div>
</header>
```

**Acceptance Criteria**:
- [ ] ThemeToggle visible in header
- [ ] Doesn't break existing layout
- [ ] Works on mobile/tablet sizes

**Files to Modify**:
- `frontend/src/App.tsx`
- `frontend/src/App.css`

---

### S5-010: System Theme Detection and Auto-Switching ⏳ PENDING
**Story Points**: 1
**Priority**: Medium
**Dependencies**: S5-004

**Tasks**:
- [ ] Add system theme change listener
- [ ] Auto-apply theme when system theme changes (if theme='system')
- [ ] Clean up listener on component unmount
- [ ] Test with OS theme switch

**Implementation**:
```typescript
// App.tsx or custom hook
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    if (theme === 'system') {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => mediaQuery.removeEventListener('change', handleChange);
}, [theme]);
```

**Acceptance Criteria**:
- [ ] App theme changes when OS theme changes (if theme='system')
- [ ] No changes if theme is manually set to 'light' or 'dark'
- [ ] Listener cleaned up properly

**Files to Modify**:
- `frontend/src/App.tsx` or create `hooks/useTheme.ts`

---

### S5-011: Manual Testing ⏳ PENDING
**Story Points**: 2
**Priority**: High
**Dependencies**: All previous tasks

**Test Checklist**:
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] System theme detection works
- [ ] Theme toggle works smoothly
- [ ] Theme persists after page refresh
- [ ] All components styled correctly in both themes
- [ ] Transitions are smooth
- [ ] No visual bugs or glitches
- [ ] No console errors
- [ ] Text is readable in both themes (contrast check)
- [ ] Shadows and borders visible in both themes
- [ ] Test on different browsers (Chrome, Firefox, Edge)
- [ ] Test system theme auto-switch

**Browser Testing**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**Component Testing**:
- [ ] Header
- [ ] Sidebar
- [ ] Folder tree
- [ ] Prompt grid
- [ ] Prompt list
- [ ] Prompt cards
- [ ] Edit modal
- [ ] Search bar
- [ ] Command palette
- [ ] Shortcuts help
- [ ] Delete confirmation dialog
- [ ] Toast notifications

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] No visual bugs
- [ ] User approves design

---

### S5-012: Update Documentation ⏳ PENDING
**Story Points**: 1
**Priority**: Medium
**Dependencies**: S5-011

**Tasks**:
- [ ] Update README.md with dark mode feature
- [ ] Document theme system in ARCHITECTURE.md
- [ ] Add sprint completion to COMPLETED.md
- [ ] Update USER_GUIDE.md with theme switching instructions

**Documentation Updates**:

**README.md**:
```markdown
### UI Features
- **Dark Mode**: Toggle between light, dark, and system themes with smooth transitions
```

**USER_GUIDE.md**:
```markdown
## Changing Themes

Prompt Manager supports three theme modes:
- **Light**: Classic light theme
- **Dark**: Easy-on-the-eyes dark theme
- **System**: Automatically matches your OS theme

To change themes:
1. Click the theme icon in the header (☀️ or 🌙)
2. Select your preferred theme from the dropdown
3. Your choice will be saved automatically
```

**Acceptance Criteria**:
- [ ] All docs updated
- [ ] Code examples accurate
- [ ] Screenshots updated (if applicable)

**Files to Modify**:
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/USER_GUIDE.md`
- `project-management/COMPLETED.md`
- `project-management/SPRINT_05.md` (this file)

---

## Sprint Metrics

**Total Story Points**: 13
**Estimated Duration**: 4-6 hours
**Risk Level**: Low (mostly CSS changes, no database modifications)

**Breakdown**:
- Phase 1 (Planning): 2 points
- Phase 2 (Core): 5 points
- Phase 3 (Styling): 4 points
- Phase 4 (Polish): 2 points

---

## Definition of Done

- [ ] Dark mode color palette defined and tested
- [ ] Theme toggle in header with Light/Dark/System options
- [ ] Theme preference persists across sessions
- [ ] System theme auto-detection works
- [ ] All components styled for both themes
- [ ] Smooth theme transition animations
- [ ] No hardcoded colors in CSS (all use variables)
- [ ] Text readable in both themes (WCAG AA contrast)
- [ ] No console errors or warnings
- [ ] Documentation updated
- [ ] User tested and approved

---

## Technical Debt / Future Enhancements

- [ ] Add high contrast mode for accessibility
- [ ] Add custom theme creator (let users define their own colors)
- [ ] Add theme preview before applying
- [ ] Add more theme options (e.g., blue, purple variants)
- [ ] Add theme-aware syntax highlighting for code blocks
- [ ] Consider persisting theme to backend for multi-device sync

---

## Recovery Procedures

### Rollback Commands
```bash
# Check git status
git status

# Restore specific file if needed
git checkout frontend/src/styles/themes.css
git checkout frontend/src/store/uiStore.ts
git checkout frontend/src/components/ThemeToggle.tsx

# Restore all CSS files
git checkout frontend/src/**/*.css

# Test frontend compilation
cd frontend
npm run dev
```

### If Session Interrupted

**During Planning (S5-001, S5-002)**:
- ✅ Safe to restart - no code changes
- Resume from S5-003

**During Core Implementation (S5-003 to S5-005)**:
- ⚠️ Check which files were modified
- Test if theme toggle works
- If broken, rollback and restart phase

**During Styling (S5-006, S5-007)**:
- ⚠️ Some components may look broken
- Check which CSS files were converted
- Complete or revert incomplete conversions
- Test visual appearance

**During Polish (S5-008 to S5-012)**:
- ✅ Mostly safe to resume
- Re-test any incomplete features

---

**Status**: Ready to begin Sprint 5
**Next Action**: Start with S5-001 (Design Dark Mode Color Palette)
