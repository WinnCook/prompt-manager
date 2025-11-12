# Prompt Manager Backend

FastAPI backend server for the Prompt Manager application.

## Setup

### Prerequisites
- Python 3.10 or higher
- pip

### Installation

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate virtual environment:
   - Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

### Development Mode

```bash
python -m app.main
```

Or with auto-reload:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at `http://localhost:8000`

### API Documentation

Once the server is running, access the interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/                 # API route handlers
│   │   ├── __init__.py
│   │   └── routers/
│   │       ├── folders.py   # Folder endpoints
│   │       ├── prompts.py   # Prompt endpoints
│   │       ├── claude.py    # Claude integration endpoints
│   │       └── search.py    # Search endpoints
│   ├── services/            # Business logic
│   │   ├── folder_service.py
│   │   ├── prompt_service.py
│   │   ├── claude_service.py
│   │   └── search_service.py
│   ├── db/                  # Database layer
│   │   ├── database.py      # DB connection
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── init_db.py       # DB initialization
│   │   └── repositories/    # Data access layer
│   │       ├── folder_repository.py
│   │       ├── prompt_repository.py
│   │       └── claude_repository.py
│   ├── models/              # Pydantic models (API contracts)
│   │   ├── folder.py
│   │   ├── prompt.py
│   │   └── claude_job.py
│   └── core/                # Core utilities
│       ├── config.py        # Configuration
│       ├── exceptions.py    # Custom exceptions
│       └── error_handlers.py # Exception handlers
├── tests/                   # Test files
│   ├── conftest.py
│   ├── test_folders_api.py
│   └── test_prompts_api.py
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Testing

Run all tests:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app --cov-report=html
```

View coverage report:
```bash
# Open htmlcov/index.html in browser
```

## Code Quality

Format code with Black:
```bash
black app/
```

Lint with flake8:
```bash
flake8 app/
```

Type check with mypy:
```bash
mypy app/
```

## Environment Variables

Create a `.env` file in the backend directory (optional):

```env
# Database
DATABASE_URL=sqlite:///./prompts.db

# Claude CLI
CLAUDE_CLI_PATH=claude  # or full path if not in PATH

# Server
HOST=127.0.0.1
PORT=8000
DEBUG=True
```

## Database

The application uses SQLite by default. The database file will be created at:
- `./prompts.db` (or path specified in DATABASE_URL)

### Initialize Database

The database is automatically initialized on first run. To manually initialize:

```bash
python -m app.db.init_db
```

### Database Migrations

(To be implemented with Alembic in future sprints)

## API Endpoints

See [API_SPEC.md](../docs/API_SPEC.md) for complete API documentation.

### Quick Reference

**Folders**:
- `GET /api/folders` - Get folder tree
- `POST /api/folders` - Create folder
- `PUT /api/folders/{id}` - Update folder
- `DELETE /api/folders/{id}` - Delete folder

**Prompts**:
- `GET /api/prompts` - List prompts
- `GET /api/prompts/{id}` - Get prompt
- `POST /api/prompts` - Create prompt
- `PUT /api/prompts/{id}` - Update prompt
- `DELETE /api/prompts/{id}` - Delete prompt
- `POST /api/prompts/{id}/move` - Move prompt
- `POST /api/prompts/{id}/duplicate` - Duplicate prompt

**Claude Integration**:
- `POST /api/claude/rewrite` - Submit for enhancement
- `GET /api/claude/status/{job_id}` - Check status
- `GET /api/claude/result/{job_id}` - Get result

**Search**:
- `GET /api/search?q={query}` - Search prompts

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, specify a different port:
```bash
uvicorn app.main:app --port 8001
```

### Database Locked

If you get "database is locked" error:
- Ensure no other instance of the server is running
- Close any SQLite browser tools
- Restart the server

### Import Errors

If you get import errors:
- Ensure virtual environment is activated
- Ensure you're running from the backend directory
- Try reinstalling dependencies: `pip install -r requirements.txt --force-reinstall`

## Development Tips

### Auto-reload

Use `--reload` flag during development for automatic reloading on code changes:
```bash
uvicorn app.main:app --reload
```

### Debug Mode

Enable debug logging:
```bash
uvicorn app.main:app --reload --log-level debug
```

### Interactive API Testing

Use the Swagger UI at http://localhost:8000/docs to test API endpoints interactively.

## Contributing

See [ONBOARDING.md](../docs/ONBOARDING.md) for development guidelines and project structure.
