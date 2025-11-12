# Prompt Manager

A professional desktop application for organizing, managing, and enhancing prompts with AI-powered rewrites using Claude CLI.

## Overview

Prompt Manager is a productivity tool designed to help users organize their prompt library with an intuitive folder-based navigation system, powerful editing capabilities, and automatic prompt enhancement through Claude AI integration.

## Key Features

- **Hierarchical Organization**: Organize prompts in folders and subfolders
- **AI-Powered Enhancement**: Automatic prompt rewriting using Claude CLI
- **Intuitive UI**: Left navigation panel, right content area with hover actions
- **Quick Actions**: Copy, edit, and duplicate prompts with single clicks
- **Drag & Drop**: Move prompts between folders effortlessly
- **Version Control**: Track original and enhanced versions of prompts

## Technology Stack

- **Frontend**: Electron + React + TypeScript
- **Backend**: Python FastAPI
- **Database**: SQLite
- **AI Integration**: Claude CLI

## Project Structure

```
prompt-manager/
├── docs/                      # Comprehensive documentation
│   ├── ARCHITECTURE.md        # System architecture and design
│   ├── API_SPEC.md           # API endpoints and contracts
│   ├── ONBOARDING.md         # AI agent onboarding guide
│   └── USER_GUIDE.md         # End-user documentation
├── project-management/        # Agile project management
│   ├── BACKLOG.md            # Product backlog
│   ├── SPRINT_01.md          # Sprint 1 planning
│   ├── SPRINT_02.md          # Sprint 2 planning
│   └── COMPLETED.md          # Completed work tracking
├── backend/                   # Python FastAPI backend
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Data models
│   │   └── db/               # Database utilities
│   └── requirements.txt
├── frontend/                  # Electron + React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page layouts
│   │   └── services/         # API clients
│   └── electron/             # Electron main process
└── README.md
```

## Quick Start

See [ONBOARDING.md](docs/ONBOARDING.md) for detailed setup instructions.

## Development Workflow

This project follows an Agile methodology with:
- Sprint planning in `/project-management/SPRINT_*.md`
- Product backlog in `/project-management/BACKLOG.md`
- Completed work tracking in `/project-management/COMPLETED.md`

## Documentation

- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Specification**: [docs/API_SPEC.md](docs/API_SPEC.md)
- **Onboarding Guide**: [docs/ONBOARDING.md](docs/ONBOARDING.md)
- **User Guide**: [docs/USER_GUIDE.md](docs/USER_GUIDE.md)

## License

MIT License
