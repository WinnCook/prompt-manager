# Prompt Manager User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Managing Folders](#managing-folders)
3. [Working with Prompts](#working-with-prompts)
4. [AI Enhancement](#ai-enhancement)
5. [Organizing Your Library](#organizing-your-library)
6. [Tips & Tricks](#tips--tricks)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation

1. Download the latest release for your platform (Windows/macOS/Linux)
2. Install the application
3. Launch Prompt Manager

### First Launch

On first launch, Prompt Manager will:
- Create a local database
- Set up a default "Root" folder
- Check for Claude CLI availability

### Main Interface

```
┌─────────────────────────────────────────────────┐
│  Prompt Manager                          [_][□][×]│
├───────────────┬─────────────────────────────────┤
│               │                                 │
│  FOLDERS      │         PROMPTS                │
│  (Left Panel) │      (Right Panel)             │
│               │                                 │
└───────────────┴─────────────────────────────────┘
```

**Left Panel**: Folder navigation tree
**Right Panel**: Prompt cards in selected folder

---

## Managing Folders

### Creating a Folder

1. Right-click on the parent folder
2. Select "New Folder"
3. Enter folder name
4. Press Enter

**Keyboard Shortcut**: `Ctrl+N` (with folder selected)

### Renaming a Folder

1. Right-click on the folder
2. Select "Rename"
3. Enter new name
4. Press Enter

**Alternative**: Double-click folder name to edit

### Deleting a Folder

1. Right-click on the folder
2. Select "Delete"
3. Confirm deletion

**Warning**: Deleting a folder removes all subfolders and prompts inside.

### Moving a Folder

**Drag & Drop**:
1. Click and hold on folder name
2. Drag to new parent folder
3. Release mouse button

**Right-Click Menu**:
1. Right-click on folder
2. Select "Move to..."
3. Choose destination folder

### Folder Organization Best Practices

```
📁 Root
├─ 📁 Work
│  ├─ 📁 Code Reviews
│  ├─ 📁 Documentation
│  └─ 📁 Bug Reports
├─ 📁 Personal
│  ├─ 📁 Creative Writing
│  └─ 📁 Learning
└─ 📁 Templates
   ├─ 📁 General
   └─ 📁 Specialized
```

---

## Working with Prompts

### Creating a New Prompt

**Method 1: Quick Create**
1. Click "New Prompt" button
2. Enter prompt text
3. Click "Save"

**Method 2: With Title**
1. Click "New Prompt" button
2. Click "Show Options"
3. Enter title and tags
4. Enter prompt text
5. Click "Save"

### Prompt Card Actions

When hovering over a prompt card, three buttons appear:

**📋 Copy** - Copies prompt text to clipboard
- Click to copy immediately
- Visual confirmation with toast notification

**✏️ Edit** - Opens edit modal
- Modify title, content, tags
- View version history
- Save changes or cancel

**📄 Duplicate** - Creates a copy
- Creates copy in same folder
- Title becomes "{Original Title} (Copy)"
- Opens edit modal for the new copy

### Editing a Prompt

1. Click the "Edit" button on prompt card
2. Modify title, content, or tags
3. Click "Save" to confirm
4. Click "Cancel" to discard changes

**Auto-save**: Changes are saved to version history automatically

### Deleting a Prompt

1. Click "Edit" on prompt card
2. Click "Delete" button in modal footer
3. Confirm deletion

**Keyboard Shortcut**: Select prompt and press `Delete`

### Moving a Prompt

**Drag & Drop** (Recommended):
1. Click and hold on prompt card
2. Drag to target folder in left panel
3. Release mouse button
4. Prompt moves to new folder

**Cut & Paste**:
1. Right-click on prompt
2. Select "Cut" or press `Ctrl+X`
3. Select target folder
4. Right-click and select "Paste" or press `Ctrl+V`

---

## AI Enhancement

### Automatic Enhancement

By default, when you create a new prompt:
1. Original prompt is saved immediately
2. Claude CLI is invoked in background
3. Enhanced version is generated
4. You're notified when ready

### Reviewing Enhanced Prompts

When enhancement completes, you'll see a notification:

```
┌─────────────────────────────────────────┐
│  AI Enhancement Ready                   │
│  ────────────────────────────────────   │
│  Your prompt has been enhanced!         │
│                                         │
│  [Review]  [Dismiss]                    │
└─────────────────────────────────────────┘
```

Click "Review" to see the comparison:

```
┌─────────────────────────────────────────────────┐
│  AI Enhancement Preview                         │
├─────────────────────────────────────────────────┤
│  Original:                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ Write a function that sorts an array     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Enhanced:                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ Create a well-documented, type-safe      │ │
│  │ function that efficiently sorts an array │ │
│  │ using the optimal algorithm for the      │ │
│  │ given input size and characteristics.    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [Accept Enhancement]  [Keep Original]  [Edit] │
└─────────────────────────────────────────────────┘
```

### Accepting Enhancements

Click "Accept Enhancement" to:
- Update prompt with enhanced version
- Save original as version 1 in history
- Mark prompt as "AI Enhanced" with badge

### Keeping Original

Click "Keep Original" to:
- Discard enhanced version
- Keep your original prompt
- Enhancement can be requested again later

### Manual Enhancement

To enhance an existing prompt:
1. Click "Edit" on prompt card
2. Click "Enhance with AI" button
3. Wait for Claude to process
4. Review and accept/reject

**Note**: Manual enhancement requires Claude CLI to be installed and configured.

---

## Organizing Your Library

### Using Tags

Tags help categorize prompts across folders:

1. Click "Edit" on prompt
2. In the tags field, enter tags separated by commas
3. Click "Save"

**Example tags**: `code, python, review, template, urgent`

### Searching Prompts

Use the search bar at top:
1. Type search query
2. Results appear instantly
3. Click result to navigate to prompt

**Search tips**:
- Searches both title and content
- Case-insensitive
- Partial word matching

### Filtering by Tags

Click on any tag to see all prompts with that tag:
1. Prompts show tag badges
2. Click a tag badge
3. Filter view shows matching prompts

### Version History

Every prompt maintains version history:
1. Click "Edit" on prompt
2. Click "History" tab
3. View all versions with timestamps
4. Click any version to preview
5. Click "Restore" to revert to that version

---

## Tips & Tricks

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Prompt | `Ctrl+N` |
| Search | `Ctrl+F` |
| Copy Prompt | `Ctrl+C` (when selected) |
| Edit Prompt | `Enter` (when selected) |
| Delete Prompt | `Delete` |
| Navigate Folders | `Arrow Keys` |
| Expand/Collapse Folder | `Space` |

### Quick Actions

**Quick Copy**: Click prompt card once to select, then `Ctrl+C`

**Bulk Operations**: Select multiple prompts with `Ctrl+Click` or `Shift+Click`

**Folder Quick Jump**: Type folder name to jump to it in navigation

### Organization Strategies

**By Project**:
```
📁 Projects
├─ 📁 Project A
│  ├─ Planning Prompts
│  ├─ Code Prompts
│  └─ Review Prompts
└─ 📁 Project B
```

**By Type**:
```
📁 Prompt Library
├─ 📁 Code Generation
├─ 📁 Code Review
├─ 📁 Documentation
├─ 📁 Testing
└─ 📁 Debugging
```

**By Frequency**:
```
📁 Prompts
├─ 📁 Daily Use
├─ 📁 Weekly Use
└─ 📁 Templates
```

### AI Enhancement Tips

**Be specific in original prompt**: The more context you provide, the better Claude can enhance it.

**Review carefully**: AI enhancements are suggestions - always review before accepting.

**Iterate**: Accept enhancement, edit if needed, enhance again for refinement.

---

## Troubleshooting

### Claude Enhancement Not Working

**Check Claude CLI**:
```bash
claude --version
```

If not installed:
1. Install Claude CLI
2. Authenticate with `claude login`
3. Restart Prompt Manager

### Prompts Not Appearing

1. Check you're viewing the correct folder
2. Clear search/filter if active
3. Restart application
4. Check database file exists: `~/.prompt-manager/prompts.db`

### Drag & Drop Not Working

- Ensure you're dragging to a valid folder
- Can't drag folder into its own subfolder
- Try using cut & paste instead

### Performance Issues

**Large library** (1000+ prompts):
- Use folders to organize
- Search instead of browsing
- Close and reopen app periodically

**Slow enhancement**:
- Claude CLI may be rate-limited
- Check internet connection
- Try manual enhancement with smaller batches

### Data Backup

Your data is stored in:
- **Windows**: `C:\Users\{username}\AppData\Roaming\prompt-manager\prompts.db`
- **macOS**: `~/Library/Application Support/prompt-manager/prompts.db`
- **Linux**: `~/.config/prompt-manager/prompts.db`

**Backup recommendation**: Copy this file regularly to safe location.

### Reset Application

If you encounter persistent issues:
1. Close Prompt Manager
2. Delete database file (after backup!)
3. Restart Prompt Manager
4. Fresh database will be created

---

## Support

**Documentation**: Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

**Issues**: Report bugs and request features via issue tracker

**Community**: Share tips and get help in discussions

---

**Happy Prompting! 🚀**
