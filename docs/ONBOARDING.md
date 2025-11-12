# AI Agent Onboarding Guide

Welcome! This guide will help you quickly understand the Prompt Manager project and start contributing effectively.

## Project Purpose

Prompt Manager is a desktop application that helps users organize and enhance their AI prompts through:
- Hierarchical folder organization
- AI-powered prompt rewriting using Claude CLI
- Quick copy/edit/duplicate actions
- Drag-and-drop organization

## Tech Stack at a Glance

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Electron + React + TypeScript | Desktop UI |
| **Backend** | Python FastAPI | REST API server |
| **Database** | SQLite | Local data storage |
| **AI Integration** | Claude CLI | Prompt enhancement |

## Project Structure Quick Reference

```
prompt-manager/
├── docs/                      # You are here!
│   ├── ARCHITECTURE.md        # Deep dive into system design
│   ├── API_SPEC.md           # API endpoints and contracts
│   └── ONBOARDING.md         # This file
├── project-management/        # Work tracking
│   ├── BACKLOG.md            # Upcoming work
│   ├── SPRINT_01.md          # Current sprint tasks
│   └── COMPLETED.md          # Done work
├── backend/                   # Python FastAPI
│   ├── app/
│   │   ├── api/              # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Pydantic models
│   │   └── db/               # Database setup
│   └── requirements.txt
└── frontend/                  # Electron + React
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/            # Page layouts
    │   └── services/         # API clients
    └── electron/             # Electron main process
```

## 5-Minute Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Claude CLI installed and configured

### Setup

1. **Backend Setup**
   ```bash
   cd prompt-manager/backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   python -m app.main  # Starts server on http://localhost:8000
   ```

2. **Frontend Setup**
   ```bash
   cd prompt-manager/frontend
   npm install
   npm run dev  # Development mode
   ```

## Key Concepts

### 1. Data Model

**Folders** → **Prompts** → **Versions**

- A **Folder** can contain subfolders and prompts (hierarchical)
- A **Prompt** belongs to one folder and has content
- Each prompt can have multiple **Versions** (history tracking)
- When a prompt is AI-enhanced, both original and enhanced versions are stored

### 2. Claude Integration Flow

```
User creates prompt
    ↓
Saved to database
    ↓
Background job created
    ↓
Claude CLI invoked
    ↓
Enhanced version returned
    ↓
User accepts/rejects enhancement
```

### 3. UI Layout

```
┌─────────────────────────────────────────────────┐
│  Prompt Manager                          [_][□][×]│
├───────────────┬─────────────────────────────────┤
│               │                                 │
│  📁 Root      │  ┌─────────────┐ ┌───────────┐ │
│  ├─📁 Work   │  │ Prompt 1    │ │ Prompt 2  │ │
│  │  ├─ Dev   │  │             │ │           │ │
│  │  └─ QA    │  │ [Copy][Edit]│ │[Copy][Ed..]│ │
│  └─📁 Personal│  └─────────────┘ └───────────┘ │
│               │                                 │
│               │  ┌─────────────┐               │
│               │  │ Prompt 3    │               │
│               │  │             │               │
│               │  │ [Copy][Edit]│               │
│               │  └─────────────┘               │
└───────────────┴─────────────────────────────────┘
```

## Working on Tasks

### Finding Your Next Task

1. Check `/project-management/SPRINT_01.md` for current sprint tasks
2. Look for tasks marked `[ ]` (not started)
3. Review task acceptance criteria
4. Check dependencies - some tasks require others to be completed first

### Task Workflow

1. **Read the task** in sprint file
2. **Review dependencies** (if any)
3. **Check ARCHITECTURE.md** for relevant component details
4. **Check API_SPEC.md** if working on API/integration
5. **Implement** following the coding standards below
6. **Update sprint file** - mark task as completed with `[x]`
7. **Move task** to COMPLETED.md with completion notes

### Coding Standards

#### Backend (Python)
```python
# Use type hints
def create_prompt(folder_id: int, content: str) -> Prompt:
    """Create a new prompt in the specified folder.

    Args:
        folder_id: The ID of the parent folder
        content: The prompt content text

    Returns:
        The created Prompt object
    """
    pass

# Use Pydantic for validation
class PromptCreate(BaseModel):
    folder_id: int
    title: str
    content: str
    tags: Optional[List[str]] = []

# Use async/await for I/O
async def invoke_claude_cli(content: str) -> str:
    process = await asyncio.create_subprocess_exec(...)
```

#### Frontend (TypeScript + React)
```typescript
// Use functional components with TypeScript
interface PromptCardProps {
  prompt: Prompt;
  onCopy: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onCopy,
  onEdit,
  onDuplicate
}) => {
  // Component logic
};

// Use custom hooks for API calls
const usePrompts = (folderId: string) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  // ...
};
```

## Common Tasks Reference

### Adding a New API Endpoint

1. **Define model** in `backend/app/models/`
2. **Add route** in `backend/app/api/routers/`
3. **Implement service** in `backend/app/services/`
4. **Update API_SPEC.md** with endpoint documentation
5. **Create frontend client** in `frontend/src/services/`

### Adding a New UI Component

1. **Create component** in `frontend/src/components/`
2. **Add props interface** with TypeScript
3. **Implement render logic** with React hooks
4. **Add styles** (CSS modules or styled-components)
5. **Export** from components/index.ts

### Database Schema Changes

1. **Update schema** in `backend/app/db/schema.py`
2. **Create migration** script
3. **Update models** in `backend/app/models/`
4. **Update repositories** if needed
5. **Document** in ARCHITECTURE.md

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
pytest tests/api/test_prompts.py -v  # Specific test
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:e2e  # End-to-end tests
```

## Debugging

### Backend
- FastAPI auto-docs: http://localhost:8000/docs
- Check logs in console where server is running
- Use `breakpoint()` for debugging
- SQLite browser for database inspection

### Frontend
- React DevTools browser extension
- Electron DevTools (F12 in app)
- Network tab for API call inspection
- Console for errors and logs

## Project Management

### Sprint Structure
- **2-week sprints**
- Sprint planning at start
- Daily progress updates in sprint file
- Sprint review/retrospective at end

### Definition of Done
- [ ] Code implemented and follows standards
- [ ] Tests written and passing
- [ ] Documentation updated (if needed)
- [ ] Code reviewed (self-review minimum)
- [ ] No console errors/warnings
- [ ] Works on fresh install

## Getting Help

### Documentation Priority
1. **ONBOARDING.md** (this file) - Start here
2. **ARCHITECTURE.md** - System design deep dive
3. **API_SPEC.md** - API contracts and examples
4. **Sprint files** - Current work and context
5. **Code comments** - Inline documentation

### Common Issues

**Issue**: Backend won't start
- Check Python version (3.10+)
- Verify virtual environment is activated
- Check if port 8000 is available

**Issue**: Claude CLI integration fails
- Verify Claude CLI is installed: `claude --version`
- Check Claude CLI authentication
- Review error logs in backend console

**Issue**: Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check CORS settings in backend
- Verify API_URL in frontend config

## Communication Guidelines

### When Starting a Task
1. Review the full task description
2. Check all dependencies are completed
3. Verify acceptance criteria are clear
4. If anything is unclear, ask questions

### When Completing a Task
1. Mark task as `[x]` in sprint file
2. Move to COMPLETED.md with notes:
   - What was implemented
   - Any challenges or decisions made
   - Any follow-up needed
3. Update documentation if needed

### When Blocked
1. Document what's blocking you
2. Note in sprint file with `[BLOCKED]` tag
3. Suggest potential solutions
4. Ask for guidance on approach

## Best Practices

### Code Quality
- Write self-documenting code with clear names
- Add comments for complex logic only
- Keep functions small and focused
- Follow DRY principle

### Git Commits
- Write clear commit messages
- One logical change per commit
- Reference task number if applicable

### Performance
- Lazy load data where possible
- Use pagination for large lists
- Optimize database queries (indexes)
- Profile before optimizing

### Security
- Validate all user input
- Use parameterized queries
- No sensitive data in logs
- Bind backend to localhost only

## Quick Reference: File Locations

| Need to... | Look in... |
|------------|-----------|
| Add API endpoint | `backend/app/api/routers/` |
| Business logic | `backend/app/services/` |
| Database queries | `backend/app/db/repositories/` |
| Data models | `backend/app/models/` |
| React components | `frontend/src/components/` |
| API clients | `frontend/src/services/` |
| App pages | `frontend/src/pages/` |
| Electron config | `frontend/electron/` |

## Success Checklist

Before claiming a task is complete:
- [ ] Code runs without errors
- [ ] Follows project coding standards
- [ ] Documentation updated (if applicable)
- [ ] Tests pass (if tests exist)
- [ ] Checked in both dev and production modes
- [ ] No TODO or FIXME comments left
- [ ] Sprint file updated
- [ ] COMPLETED.md updated with notes

---

**Welcome to the team! Start with Sprint 1 tasks and feel free to improve this onboarding guide as you learn.**
