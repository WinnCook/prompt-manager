# ⚠️ CRITICAL: Process Management Safety Protocol

## Incident Report - 2025-11-13

**What Happened:**
- During Prompt Manager debugging, Python processes were killed too broadly
- This accidentally terminated an unrelated **intraday snapshot scheduler**
- **RESULT:** Lost hourly data collection - data is PERMANENTLY GONE

## Lessons Learned

### ❌ NEVER DO THIS:
```bash
# DO NOT kill all Python processes
tasklist | findstr python
taskkill /F /PID <all_python_pids>  # TOO BROAD!
```

### ✅ ALWAYS DO THIS:
```bash
# ONLY kill processes on specific ports used by THIS project
netstat -ano | findstr ":8001 "  # Prompt Manager backend port
netstat -ano | findstr ":8002 "  # Alternate backend port
netstat -ano | findstr ":5173 "  # Vite frontend port

# Then kill ONLY those specific PIDs after verifying they're not other projects
```

### ✅ BETTER: Use Project-Specific venv
```bash
# Kill ONLY processes from this project's venv
cd C:/Users/winnl/Documents/ClaudeCodePlayground/prompt-manager/backend
# Check if process is using THIS specific venv before killing
```

## Port Assignments for This Project

**Prompt Manager Uses:**
- `8001` - Backend API (primary)
- `8002` - Backend API (alternate for testing)
- `5173` - Vite frontend dev server

**DO NOT TOUCH Other Ports!**

## Recovery Checklist

If you accidentally kill processes:

1. Check what was killed: `tasklist /v | findstr python`
2. Check scheduler status immediately
3. Restart any critical background services
4. Document what was lost

## For Future AI Agents

**BEFORE killing any process:**
1. ✅ Verify it's on a port used by Prompt Manager (8001, 8002, 5173)
2. ✅ Check the command line to ensure it's FROM this project's path
3. ✅ NEVER use broad `taskkill` on "python.exe"
4. ✅ Use the PowerShell script (`check_processes.ps1`) which ONLY targets ports 8000/8001

---

**Current Status of Other Systems:**
- ✅ Intraday snapshot scheduler: **RESTARTED** (after incident)
- ⚠️ Lost data: Cannot be backfilled
- 📋 Lesson: Separate venvs, check before killing

---

**Date:** 2025-11-13
**Severity:** CRITICAL
**Impact:** Data loss in unrelated system
**Prevention:** This document + careful process targeting
