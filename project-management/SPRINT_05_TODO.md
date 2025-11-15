# Sprint 5: Dark Mode - TODO for Next Session

## 🐛 Bug Found During Testing (High Priority)

### Issue: Selected Folder Text Readability in Dark Mode

**Problem**:
When a folder is selected (highlighted with light blue background), the white text is hard to read against the light blue background in dark mode.

**Current Behavior**:
- Unselected folders: White text on dark background ✅ (good)
- Selected folders: White text on light blue background ❌ (hard to read)

**Desired Behavior**:
- Unselected folders: White text on dark background
- Selected folders: Black/dark text on light blue background

**Solution**:
Update `FolderTree.css` to change text color when folder is selected:

```css
/* In FolderTree.css */
.folder-item.selected {
  background-color: var(--accent-primary);
  color: var(--text-inverse); /* This should be black/dark in dark mode */
}
```

**Better Solution**:
Add a new CSS variable for "text on accent background":
```css
/* In themes.css */
:root {
  --text-on-accent: #ffffff; /* Light theme: white text on blue */
}

[data-theme="dark"] {
  --text-on-accent: #1e1e1e; /* Dark theme: dark text on blue */
}

/* Then in FolderTree.css */
.folder-item.selected {
  background-color: var(--accent-primary);
  color: var(--text-on-accent);
}
```

**Files to Modify**:
- `frontend/src/styles/themes.css` - Add `--text-on-accent` variable
- `frontend/src/components/FolderTree.css` - Use the new variable for selected folders

**Priority**: High (affects UX in dark mode)

---

## ✅ Completed Today

1. ✅ Created theme system with CSS variables
2. ✅ Added theme state management (light/dark/system)
3. ✅ Created ThemeToggle component
4. ✅ Converted App.css to use CSS variables
5. ✅ Added theme initialization and system detection
6. ✅ Theme toggle appears in header and works
7. ✅ Theme persists to localStorage

---

## 📋 Remaining Tasks for Sprint 5

### High Priority

**S5-007: Convert Component CSS Files to Use CSS Variables**
- [ ] PromptCard.css
- [ ] PromptListItem.css
- [ ] FolderTree.css (include fix for selected folder text)
- [ ] EditModal.css
- [ ] SearchBar.css
- [ ] ResizableDivider.css
- [ ] ViewToggle.css
- [ ] CommandPalette.css
- [ ] ShortcutsHelp.css
- [ ] ConfirmDialog.css
- [ ] SearchResults.css
- [ ] EnhanceCompareModal.css
- [ ] NewFolderButton.css
- [ ] DeleteFolderButton.css
- [ ] VariableFillDialog.css
- [ ] PromptGrid.css
- [ ] PromptList.css

**Pattern to Follow**:
```css
/* Before */
.element {
  background-color: #ffffff;
  color: #2c3e50;
  border: 1px solid #bdc3c7;
}

/* After */
.element {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

### Medium Priority

**S5-008: Polish and Testing**
- [ ] Test all components in light mode
- [ ] Test all components in dark mode
- [ ] Verify smooth transitions when switching themes
- [ ] Check contrast ratios (WCAG AA compliance)
- [ ] Test on different browsers

**S5-009: Documentation**
- [ ] Update README.md with dark mode feature
- [ ] Update SPRINT_05.md with completion status
- [ ] Add to COMPLETED.md
- [ ] Update USER_GUIDE.md with theme instructions

---

## 📊 Progress

**Story Points**: 13 total
- Completed: ~9 points (69%)
- Remaining: ~4 points (31%)

**Estimated Time to Complete**: 1-2 hours

---

## 🎯 Quick Start for Next Session

1. **Fix the selected folder bug first** (15 minutes)
   - Add `--text-on-accent` variable to themes.css
   - Update FolderTree.css to use it

2. **Convert component CSS files** (45-60 minutes)
   - Use find/replace to convert hardcoded colors
   - Test each component after conversion

3. **Final testing and polish** (15-30 minutes)
   - Visual review in both themes
   - Fix any issues found

4. **Update documentation** (15 minutes)
   - Quick updates to README and sprint files

---

**Created**: 2025-11-14
**Status**: 69% Complete
**Next Session**: Fix selected folder text + complete remaining CSS conversions
