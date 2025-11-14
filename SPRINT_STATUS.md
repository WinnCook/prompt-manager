# Prompt Manager - AI Enhancement Feature Sprint Status

**Date:** 2025-11-12
**Status:** ⚠️ BLOCKED - Need to debug Claude CLI integration
**Last Updated:** End of Session

---

## 🎯 Goal
Implement AI-powered prompt enhancement feature that uses Claude CLI to improve user prompts.

## ✅ Completed Work

### 1. Frontend Integration (COMPLETE)
- ✅ Added enhancement state management in `App.tsx`
- ✅ Created `EnhanceCompareModal.tsx` component for side-by-side comparison
- ✅ Added AI enhance button (✨) to `PromptCard.tsx`
- ✅ Implemented full enhancement workflow:
  - Click ✨ button → Show loading modal
  - Call API to get enhancement
  - Display original vs enhanced in comparison modal
  - User selects which version to keep
  - Apply selection and create new version
- ✅ Updated API client to use port 8001

### 2. Backend API Endpoints (COMPLETE)
- ✅ Created `/api/prompts/{id}/enhance` POST endpoint
- ✅ Created `/api/prompts/{id}/apply-enhancement` POST endpoint
- ✅ Removed duplicate endpoint definitions (was causing 404 errors)
- ✅ Added extensive debug logging throughout
- ✅ Changed server port from 8000 to 8001 (to avoid zombie processes)

### 3. Claude CLI Integration (IN PROGRESS - BLOCKED)
- ✅ Implemented `ClaudeService` class in `backend/app/services/claude_service.py`
- ✅ Uses subprocess to call `claude chat --no-color` command
- ✅ Verified Claude CLI is installed at `C:\Users\winnl\AppData\Roaming\npm\claude.cmd`
- ✅ Added `shell=True` for Windows .cmd file support
- ✅ Added comprehensive logging to track execution
- ⚠️ **BLOCKED:** Still getting 500 errors when calling enhancement endpoint

---

## 🐛 Current Issue

### Symptom
- Frontend shows: "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
- URL: `http://127.0.0.1:8001/api/prompts/2/enhance`
- Modal appears for a split second then disappears

### What We Know
1. ✅ Claude CLI is installed and in PATH
2. ✅ Backend server is running on port 8001
3. ✅ Frontend is configured to call port 8001
4. ✅ Endpoint exists and is properly defined (no more 404s)
5. ❓ Backend logs don't show the request being received (suspicious)
6. ❓ May still be hitting old backend server on port 8000

### Possible Causes
1. **Multiple backend servers still running** - Browser might be hitting old server
2. **Claude CLI subprocess call failing** - Command syntax or permissions issue
3. **Browser cache** - Frontend may be cached to use old port
4. **CORS issue** - Request being blocked before reaching backend

---

## 📁 Key Files Modified

### Backend
```
backend/app/services/claude_service.py    - Claude CLI integration via subprocess
backend/app/api/routers/prompts.py        - Enhancement endpoints + debug logging
backend/app/core/config.py                - PORT changed to 8001
```

### Frontend
```
frontend/src/App.tsx                      - Enhancement state management & workflow
frontend/src/components/EnhanceCompareModal.tsx  - New comparison modal
frontend/src/components/PromptCard.tsx    - AI enhance button
frontend/src/services/api.ts              - API_BASE_URL changed to port 8001
```

---

## 🔍 Debug Information

### Backend Server Details
- **Port:** 8001
- **Process ID:** Check with `netstat -ano | findstr :8001`
- **Start Command:** `cd prompt-manager/backend && ".venv/Scripts/python.exe" -m app.main`
- **Logs:** Watch terminal for `[ENHANCE]` and `[ClaudeService]` prefixed messages

### Frontend Server Details
- **Port:** 5173 (Vite default)
- **URL:** http://localhost:5173
- **API Target:** http://127.0.0.1:8001

### Claude CLI Details
- **Location:** `C:\Users\winnl\AppData\Roaming\npm\claude.cmd`
- **Command:** `claude chat --no-color`
- **Test:** Run `where claude` to verify PATH

---

## 🚀 Next Steps for AI Agent

### Step 1: Verify Server State
```bash
# Check what's running on port 8001
netstat -ano | findstr :8001

# Check what's running on old port 8000
netstat -ano | findstr :8000

# If anything on 8000, kill it:
taskkill //F //PID <PID>
```

### Step 2: Verify Backend is Receiving Requests
1. Restart backend server fresh
2. Watch logs carefully
3. Click AI enhance button in frontend
4. **Expected:** Should see `[ENHANCE] Starting enhancement for prompt X` in logs
5. **If not seen:** Backend is NOT receiving the request (wrong port/server)

### Step 3: Test Claude CLI Manually
```bash
# Test Claude CLI works
echo "Turn this into a better prompt: Hello world" | claude chat --no-color

# If this fails, the subprocess will fail too
```

### Step 4: Debug Subprocess Call
If backend IS receiving requests but subprocess fails:

1. Check `claude_service.py` line 68-76 for the subprocess call
2. Try without `shell=True`
3. Try with full path: `C:\Users\winnl\AppData\Roaming\npm\claude.cmd`
4. Check if Claude CLI needs authentication/login
5. Try interactive test: `claude chat` (without --no-color) to see if session is active

### Step 5: Alternative Approach
If subprocess continues to fail, consider:
- Using Anthropic API instead (requires API key setup)
- Using `claude` npm package directly via Node.js subprocess
- Creating a separate Node.js microservice for Claude calls

---

## 📝 Code Snippets for Reference

### Enhancement Endpoint (prompts.py:133-178)
```python
@router.post("/{prompt_id}/enhance", response_model=PromptEnhanceResponse)
def enhance_prompt(
    prompt_id: int,
    request: PromptEnhanceRequest,
    db: Session = Depends(get_db)
):
    prompt_service = PromptService(db)
    claude_service = ClaudeService()
    prompt = prompt_service.get_prompt_by_id(prompt_id)

    try:
        print(f"[ENHANCE] Starting enhancement for prompt {prompt_id}")
        print(f"[ENHANCE] Original content: {prompt.content[:100]}...")
        enhanced = claude_service.enhance_prompt(
            original_prompt=prompt.content,
            enhancement_instruction=request.custom_instruction
        )
        print(f"[ENHANCE] Success! Enhanced content: {enhanced[:100]}...")

        return {
            "original": prompt.content,
            "enhanced": enhanced
        }
    except Exception as e:
        print(f"[ENHANCE ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to enhance prompt: {str(e)}")
```

### Claude CLI Subprocess Call (claude_service.py:68-76)
```python
result = subprocess.run(
    ["claude", "chat", "--no-color"],
    input=full_prompt,
    capture_output=True,
    text=True,
    timeout=60,
    encoding='utf-8',
    shell=True  # Use shell on Windows for .cmd files
)
```

### Frontend API Call (App.tsx:138-150)
```typescript
const result = await promptApi.enhance(prompt.id, {
  custom_instruction: enhanceModal.customInstruction
});

if (result.data) {
  setEnhanceModal(prev => ({
    ...prev,
    isLoading: false,
    original: result.data!.original,
    enhanced: result.data!.enhanced
  }));
} else {
  console.error('[Enhancement] Error:', result.error);
  // Handle error
}
```

---

## 🎓 Context for AI Agent

### User Preferences
- User has existing Claude CLI subscription - MUST use CLI not API
- User wants to see diffs/changes before applying
- Prefers minimal dependencies
- Running on Windows

### Tech Stack
- **Backend:** Python FastAPI, SQLAlchemy, SQLite
- **Frontend:** React + TypeScript, Vite, Zustand
- **Claude:** CLI via subprocess (NOT Anthropic API)

### Project Structure
```
prompt-manager/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── api/routers/
│   │   │   └── prompts.py       # Prompt endpoints
│   │   ├── services/
│   │   │   ├── claude_service.py   # Claude CLI integration
│   │   │   └── prompt_service.py   # Prompt business logic
│   │   ├── core/
│   │   │   └── config.py        # App config (PORT=8001)
│   │   └── db/                  # Database models
│   └── .venv/                   # Python virtual environment
└── frontend/
    ├── src/
    │   ├── App.tsx              # Main app with enhancement logic
    │   ├── components/
    │   │   ├── EnhanceCompareModal.tsx  # Comparison UI
    │   │   └── PromptCard.tsx   # Card with AI button
    │   └── services/
    │       └── api.ts           # API client (port 8001)
    └── node_modules/
```

---

## ⚡ Quick Start for Next Session

1. **Kill all servers:**
   ```bash
   # Find and kill backend
   netstat -ano | findstr :8001
   taskkill //F //PID <PID>

   # Kill frontend (Ctrl+C in terminal)
   ```

2. **Start fresh backend:**
   ```bash
   cd prompt-manager/backend
   ".venv/Scripts/python.exe" -m app.main
   ```

3. **Start frontend:**
   ```bash
   cd prompt-manager/frontend
   npm run dev
   ```

4. **Test manually:**
   - Open http://localhost:5173
   - Click ✨ on any prompt
   - Watch both terminal logs
   - Check browser console

5. **First thing to check:** Are the `[ENHANCE]` logs appearing in backend terminal? If NO, the request isn't reaching the backend.

---

## 🔧 Troubleshooting Commands

```bash
# Verify Claude CLI
where claude
claude --version

# Test Claude CLI manually
echo "test prompt" | claude chat --no-color

# Check running servers
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :5173

# Check Python process
tasklist | findstr python

# Check Node process
tasklist | findstr node

# Full process cleanup
powershell "Get-Process python | Where-Object {$_.Path -like '*prompt-manager*'} | Stop-Process -Force"
```

---

**END OF SESSION - READY FOR HANDOFF**
