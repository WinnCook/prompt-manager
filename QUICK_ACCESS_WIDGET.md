# Quick Access Widget - Documentation

## Overview
A floating widget that displays your favorite prompts (up to 8) in an always-on-top window. Perfect for quick access while working in VS Code or any other application.

## Features
✅ **Vertical Layout** - One column with each prompt as a row
✅ **One-Click Copy** - Click any prompt to copy it to clipboard
✅ **Always on Top** - Floats over all other applications
✅ **Auto-Refresh** - Updates every 30 seconds
✅ **Beautiful UI** - Purple gradient design with smooth animations
✅ **Smart Badges** - Shows 📝 for prompts with variables, ✨ for AI-enhanced
✅ **Toast Notifications** - Visual feedback when copying

## Quick Start

### Launch the Widget
```bash
cd prompt-manager
./launch-quick-access.ps1
```

Or double-click: `launch-quick-access.bat`

### Make it Always-on-Top

**Method 1: PowerToys (Recommended)**
1. Make sure PowerToys is installed
2. Focus the Quick Access widget window
3. Press **`Win + Alt + O`** (custom shortcut to avoid conflicts)

**Note:** The default PowerToys shortcut `Win + Ctrl + T` may conflict with other apps.

**Method 2: PowerShell Script**
If the widget is already open, run:
```bash
./set-always-on-top.ps1
```

**Method 3: All-in-One Launcher**
Launches widget and automatically sets it always-on-top:
```bash
./launch-widget-always-on-top.ps1
```

## How to Use

1. **Star Your Favorite Prompts**
   - Open the main Prompt Manager app at `http://localhost:5177`
   - Click the ⭐ icon on prompts you want quick access to
   - Maximum of 8 prompts can be starred

2. **Access from Anywhere**
   - The widget floats on top of all applications
   - Click any prompt to instantly copy it to clipboard
   - Prompts with variables show a warning (use main app to fill variables)

3. **Refresh**
   - Auto-refreshes every 30 seconds
   - Manual refresh: Click the 🔄 button

## Technical Details

### Files
- `easy-access-widget.html` - Standalone widget (single HTML file)
- `launch-quick-access.ps1` - PowerShell launcher
- `launch-quick-access.bat` - Batch launcher (alternative)
- `set-always-on-top.ps1` - Script to set existing window always-on-top
- `launch-widget-always-on-top.ps1` - All-in-one launcher with auto always-on-top

### Backend Connection
- Connects to: `http://127.0.0.1:8000/api/prompts/easy-access/list`
- CORS configured to allow `file://` protocol
- Auto-refresh interval: 30 seconds

### Customization
The widget can be customized by editing `easy-access-widget.html`:
- Window size: Modify Chrome args in launcher scripts
- Colors: Edit CSS gradient in `<style>` section
- Refresh interval: Change `setInterval` value (currently 30000ms)

## Troubleshooting

### Widget won't load prompts
- Check that backend is running on port 8000
- Refresh the widget (F5)
- Check browser console for errors

### Always-on-top not working
- Default shortcut `Win + Ctrl + T` may conflict
- Change PowerToys shortcut to `Win + Alt + O` (or your preference)
- Or use the PowerShell scripts instead

### Widget disappeared
- Relaunch with `./launch-quick-access.ps1`
- Check if Chrome closed the window

## PowerToys Shortcut Configuration

**Custom Shortcut:** `Win + Alt + O`

To change in PowerToys:
1. Open PowerToys Settings
2. Go to "Always on Top"
3. Change "Activation shortcut" to `Win + Alt + O`
4. Click Save

This avoids conflicts with other applications.

---

**Status:** ✅ Complete and Working
**Last Updated:** 2025-11-15
