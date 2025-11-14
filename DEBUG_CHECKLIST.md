# AI Enhancement Feature - Debug Checklist

## Issue: 500 Error on Enhancement Endpoint

### Quick Diagnosis Steps

#### 1. Is the backend receiving requests? (2 min)
```bash
# Start backend and watch logs
cd prompt-manager/backend
".venv/Scripts/python.exe" -m app.main

# Click AI button in frontend
# LOOK FOR: "[ENHANCE] Starting enhancement for prompt X"

✅ If you see it: Backend is receiving requests → Go to Step 3
❌ If you DON'T see it: Backend is NOT receiving requests → Go to Step 2
```

#### 2. Why isn't backend receiving requests? (5 min)
```bash
# A. Check what's on port 8001
netstat -ano | findstr :8001
# Should show: 127.0.0.1:8001 LISTENING <PID>

# B. Check if old server on 8000 is still running
netstat -ano | findstr :8000
# Should show: nothing (port should be free)
# If something is there: taskkill //F //PID <PID>

# C. Check frontend is pointing to right port
# File: frontend/src/services/api.ts
# Line 5: Should be: const API_BASE_URL = ... 'http://127.0.0.1:8001'

# D. Clear browser cache and hard refresh (Ctrl+Shift+R)

# E. Restart BOTH servers clean
```

#### 3. Backend receives request but returns 500? (10 min)
```bash
# A. Check backend logs for the actual error
# Look for: "[ENHANCE ERROR]" followed by traceback

# B. Common errors:
# - "Claude CLI not found" → Claude not in PATH
# - "Claude CLI command failed" → subprocess.run failing
# - "timed out" → Claude taking too long

# C. Test Claude CLI manually:
claude --version
echo "test prompt" | claude chat --no-color

# If manual test fails, subprocess will fail
```

#### 4. Claude CLI subprocess issues? (15 min)
The subprocess call is in `backend/app/services/claude_service.py` lines 68-76:

```python
result = subprocess.run(
    ["claude", "chat", "--no-color"],
    input=full_prompt,
    capture_output=True,
    text=True,
    timeout=60,
    encoding='utf-8',
    shell=True  # Windows .cmd file support
)
```

**Try these fixes in order:**

A. **Full path instead of command name:**
```python
["C:\\Users\\winnl\\AppData\\Roaming\\npm\\claude.cmd", "chat", "--no-color"]
```

B. **Remove shell=True:**
```python
# Remove: shell=True
```

C. **Add creationflags for Windows:**
```python
import subprocess
result = subprocess.run(
    ["claude", "chat", "--no-color"],
    input=full_prompt,
    capture_output=True,
    text=True,
    timeout=60,
    encoding='utf-8',
    creationflags=subprocess.CREATE_NO_WINDOW  # Windows-specific
)
```

D. **Check Claude CLI requires login:**
```bash
# Interactive test
claude chat

# If prompts for login/auth, CLI session expired
# Run: claude login
```

E. **Try PowerShell wrapper:**
```python
result = subprocess.run(
    ["powershell", "-Command", "claude chat --no-color"],
    input=full_prompt,
    capture_output=True,
    text=True,
    timeout=60,
    encoding='utf-8'
)
```

#### 5. Still not working? (20 min)

**Option A: Use Anthropic API instead**

1. Get API key from https://console.anthropic.com/
2. Set environment variable: `ANTHROPIC_API_KEY=your-key`
3. Revert `claude_service.py` to use `anthropic` package (code from earlier session)
4. Install: `pip install anthropic`

**Option B: Create Node.js microservice**

If Claude CLI works from command line but not from Python:

1. Create simple Node.js server that calls Claude CLI
2. Python backend calls Node.js microservice
3. Node.js returns enhanced prompt to Python

**Option C: Direct npm package usage**

```javascript
// Use @anthropic/sdk npm package directly
import Anthropic from '@anthropic-ai/sdk';
```

---

## Expected Log Flow (When Working)

### Backend Terminal:
```
[ENHANCE] Starting enhancement for prompt 2
[ENHANCE] Original content: Write a function to calculate fibonacci...
[ClaudeService] Running Claude CLI command...
[ClaudeService] Prompt length: 234 characters
[ClaudeService] Return code: 0
[ClaudeService] Stdout length: 456 characters
[ClaudeService] Stderr: None
[ClaudeService] Success! Enhanced prompt length: 456
[ENHANCE] Success! Enhanced content: Create a Python function named `fibonacci` that...
```

### Frontend Console:
```
[Enhancement] Starting enhancement for prompt: 2
[Enhancement] Calling API...
[API Request] POST /api/prompts/2/enhance Object
[API Response] /api/prompts/2/enhance Object
[Enhancement] API Result: Object { data: {...}, error: undefined }
[Enhancement] Setting modal data with enhanced prompt
```

---

## File Change History

These files were modified during implementation:

### Backend
- `backend/app/services/claude_service.py` - Created, then modified subprocess call
- `backend/app/api/routers/prompts.py` - Added enhance endpoints, removed duplicates
- `backend/app/core/config.py` - Changed PORT from 8000 to 8001

### Frontend
- `frontend/src/App.tsx` - Added enhancement state & handlers
- `frontend/src/components/EnhanceCompareModal.tsx` - Created new file
- `frontend/src/components/PromptCard.tsx` - Added AI button
- `frontend/src/services/api.ts` - Changed port to 8001

---

## Known Working Components

✅ Frontend enhancement workflow (UI, state management, API calls)
✅ Backend endpoint routing (no more 404s)
✅ Database operations (prompts, versions)
✅ Modal display logic
✅ Claude CLI is installed in PATH

❌ Claude CLI subprocess execution
❌ 500 error resolution

---

## Emergency Rollback

If you need to abandon Claude CLI integration and use API instead:

```bash
# 1. Install anthropic package
cd prompt-manager/backend
.venv\Scripts\pip install anthropic

# 2. Set API key
# Add to .env: ANTHROPIC_API_KEY=sk-ant-...

# 3. Replace claude_service.py with API version
# (Full code available in SPRINT_STATUS.md or previous session context)
```

---

## Success Criteria

When feature is working, you should see:

1. ✅ Click ✨ button → Modal opens with loading spinner
2. ✅ Backend logs show `[ENHANCE]` and `[ClaudeService]` messages
3. ✅ After ~5-10 seconds, modal shows original vs enhanced side-by-side
4. ✅ Click "Select Enhanced" → Content updates in database
5. ✅ New version created in versions table
6. ✅ Prompt marked as `is_ai_enhanced = true`
7. ✅ Modal closes, updated prompt displays

---

**Last Session End:** 2025-11-12 22:00 PST
**Status:** 500 error on enhancement endpoint, backend may not be receiving requests
**Next Agent:** Start with Step 1 of Quick Diagnosis
