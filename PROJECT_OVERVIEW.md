# Prompt Manager - Project Overview

## Executive Summary

Prompt Manager is a professional desktop application designed to help users organize, manage, and enhance their AI prompts. Built with a modern tech stack (Electron + React + FastAPI + SQLite), it features an intuitive folder-based organization system, AI-powered prompt enhancement via Claude CLI integration, and powerful productivity features like drag-and-drop, search, and version history.

## Vision

To become the essential tool for AI power users, helping them build, organize, and refine a high-quality library of prompts that improve their productivity and AI interaction quality.

## Key Features

### Core Features (Sprint 1)
- **Hierarchical Organization**: Organize prompts in nested folders
- **CRUD Operations**: Create, read, update, delete prompts and folders
- **Intuitive UI**: Two-panel layout (navigation left, content right)
- **Quick Actions**: Copy, edit, duplicate prompts with hover buttons
- **Version History**: Track all changes to prompts

### Advanced Features (Sprint 2)
- **Drag & Drop**: Move prompts and folders effortlessly
- **AI Enhancement**: Automatic prompt rewriting with Claude CLI
- **Search**: Full-text search across all prompts
- **Keyboard Shortcuts**: Power-user productivity features
- **Settings**: Customizable preferences

### Sprint 3 Features (Completed)
- **List View**: Toggle between grid and list view layouts
- **Drag-and-Drop Reordering**: Rearrange prompts with smooth animations
- **Persistent Ordering**: Custom order maintained across both views
- **Optimistic UI**: Instant feedback with error rollback

### Future Enhancements (Backlog)
- Cloud sync across devices
- Team collaboration features
- Prompt templates library
- Analytics and insights
- Browser extension
- Mobile companion app

## Technology Stack

### Frontend
- **Electron**: Desktop application framework
- **React 18**: UI library with TypeScript
- **Zustand**: Lightweight state management
- **Vite**: Fast build tool and dev server
- **@dnd-kit**: Modern drag-and-drop library with accessibility
- **Lucide React**: Modern icon library

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Embedded database
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Development Tools
- **TypeScript**: Type-safe JavaScript
- **Pytest**: Python testing
- **Playwright**: E2E testing
- **ESLint/Black**: Code formatting
- **Git**: Version control

## Project Structure

```
prompt-manager/
├── docs/                      # Comprehensive documentation
│   ├── ARCHITECTURE.md        # System design and architecture
│   ├── API_SPEC.md           # Complete API reference
│   ├── ONBOARDING.md         # AI agent onboarding guide
│   └── USER_GUIDE.md         # End-user documentation
│
├── project-management/        # Agile project tracking
│   ├── BACKLOG.md            # Product backlog
│   ├── SPRINT_01.md          # Sprint 1 (Foundation)
│   ├── SPRINT_02.md          # Sprint 2 (Advanced Features)
│   ├── SPRINT_03.md          # Sprint 3 (List View & Reordering) ✅
│   └── COMPLETED.md          # Completed work log
│
├── backend/                   # Python FastAPI backend
│   ├── app/
│   │   ├── api/routers/      # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── db/               # Database layer
│   │   ├── models/           # Pydantic models
│   │   └── core/             # Core utilities
│   ├── tests/                # Backend tests
│   ├── requirements.txt      # Python dependencies
│   └── README.md
│
├── frontend/                  # Electron + React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page layouts
│   │   ├── services/         # API clients
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript types
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utilities
│   ├── electron/             # Electron main process
│   ├── tests/                # Frontend tests
│   ├── package.json          # npm dependencies
│   └── README.md
│
├── .gitignore
├── README.md                  # Main project README
└── PROJECT_OVERVIEW.md       # This file
```

## Development Methodology

### Agile/Scrum
- **2-week sprints** with clear goals
- **Sprint planning** at start of each sprint
- **Daily standups** (optional, for teams)
- **Sprint review** and retrospective
- **Backlog grooming** for upcoming work

### Documentation First
- Comprehensive documentation before coding
- Clear architecture and API specs
- AI agent onboarding guide for smooth handoffs
- User guide for end users

### Quality Standards
- **Type safety**: TypeScript + Pydantic
- **Testing**: Unit, integration, and E2E tests
- **Code quality**: Linters, formatters, type checkers
- **Reviews**: Self-review minimum before merging

## Getting Started

### For Developers

1. **Read Documentation**:
   - Start with [ONBOARDING.md](docs/ONBOARDING.md)
   - Review [ARCHITECTURE.md](docs/ARCHITECTURE.md)
   - Check [API_SPEC.md](docs/API_SPEC.md)

2. **Set Up Environment**:
   - Backend: Follow [backend/README.md](backend/README.md)
   - Frontend: Follow [frontend/README.md](frontend/README.md)

3. **Pick a Task**:
   - Check [SPRINT_01.md](project-management/SPRINT_01.md)
   - Start with uncompleted tasks
   - Follow acceptance criteria

4. **Development Workflow**:
   - Create feature branch
   - Implement with tests
   - Self-review code
   - Update documentation
   - Mark task complete

### For AI Agents

Jump straight to [ONBOARDING.md](docs/ONBOARDING.md) for a quick-start guide specifically designed for AI agents working on this project.

## Current Status

**Phase**: Active Development ✅
**Sprint**: Sprint 3 Complete (November 14, 2025)
**Next Milestone**: Advanced features from Sprint 2 backlog

### Completed Sprints
- ✅ Sprint 1: Foundation (Core CRUD, folder hierarchy, basic UI)
- ✅ Sprint 2: Enhancements (Search, descriptions, improved UX)
- ✅ Sprint 3: List View & Reordering (100% complete, 36 story points)

### Next Steps
1. Review and prioritize Sprint 2 advanced features
2. Consider AI enhancement with Claude CLI integration
3. Implement keyboard shortcuts
4. Add drag-and-drop for grid view
5. Explore version history UI

## Success Metrics

### Sprint 1 Success ✅
- Working backend API with all CRUD endpoints
- Database schema implemented
- Basic frontend with folder navigation
- Prompt display and editing functional

### Sprint 2 Success ✅
- Search functionality implemented and working
- Description field added to prompts
- Root folder protection implemented
- UI improvements and bug fixes

### Sprint 3 Success ✅
- List view implemented with toggle
- Drag-and-drop reordering functional
- Persistent ordering across both views
- Optimistic UI with error handling
- 100% task completion rate

### MVP Success
- Users can organize prompts in folders
- Users can copy/edit/duplicate prompts
- AI enhancement improves prompt quality
- Application is stable and performant

### Long-term Success
- 1000+ active users
- Average library size: 50+ prompts per user
- 70%+ acceptance rate for AI enhancements
- <5 critical bugs per release

## Team Guidelines

### Communication
- Use clear, concise task descriptions
- Update sprint files with progress
- Document decisions and challenges
- Ask questions when blocked

### Code Standards
- Follow language-specific style guides
- Write self-documenting code
- Add comments for complex logic only
- Keep functions small and focused

### Git Workflow
- Feature branches for all work
- Clear, descriptive commit messages
- Self-review before pushing
- Keep commits atomic and logical

## Resources

### Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [API Specification](docs/API_SPEC.md)
- [Onboarding Guide](docs/ONBOARDING.md)
- [User Guide](docs/USER_GUIDE.md)

### Project Management
- [Backlog](project-management/BACKLOG.md)
- [Sprint 1](project-management/SPRINT_01.md)
- [Sprint 2](project-management/SPRINT_02.md)
- [Sprint 3](project-management/SPRINT_03.md) ✅
- [Completed Work](project-management/COMPLETED.md)

### Technical
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Main README](README.md)

## Contributing

This project welcomes contributions! Please:
1. Read the onboarding guide
2. Pick a task from current sprint
3. Follow coding standards
4. Write tests for new features
5. Update documentation
6. Self-review before submitting

## License

MIT License - See LICENSE file for details

---

**Last Updated**: 2025-11-14
**Version**: 0.3.0-alpha (Sprint 3 Complete)
**Status**: Active Development 🚀
