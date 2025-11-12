# Prompt Manager Frontend

Electron + React + TypeScript desktop application for managing prompts.

## Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Start both the React dev server and Electron:
```bash
npm run dev
```

This will:
1. Start Vite dev server at http://localhost:5173
2. Launch Electron window with hot-reload enabled

### Production Build

Build the application for distribution:
```bash
npm run build:electron
```

This creates installers in the `release/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── NavigationPanel.tsx
│   │   ├── FolderTree.tsx
│   │   ├── FolderItem.tsx
│   │   ├── PromptPanel.tsx
│   │   ├── PromptGrid.tsx
│   │   ├── PromptCard.tsx
│   │   ├── EditModal.tsx
│   │   ├── EnhancementPanel.tsx
│   │   ├── SearchBar.tsx
│   │   └── MainLayout.tsx
│   ├── pages/               # Page components
│   │   └── Home.tsx
│   ├── services/            # API clients
│   │   ├── api.ts           # Axios config
│   │   ├── folderApi.ts
│   │   ├── promptApi.ts
│   │   ├── claudeApi.ts
│   │   └── searchApi.ts
│   ├── store/               # State management
│   │   ├── folderStore.ts
│   │   ├── promptStore.ts
│   │   └── uiStore.ts
│   ├── types/               # TypeScript types
│   │   ├── api.ts
│   │   ├── folder.ts
│   │   └── prompt.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useFolders.ts
│   │   ├── usePrompts.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── utils/               # Utility functions
│   │   └── clipboard.ts
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   └── vite-env.d.ts
├── electron/                # Electron main process
│   └── main.js              # Electron entry point
├── public/                  # Static assets
│   └── icon.png
├── tests/                   # Tests
│   ├── unit/
│   └── e2e/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
└── README.md                # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

### Hot Reload

The development server supports hot module replacement (HMR). Changes to React components will reload automatically without losing state.

### DevTools

Press `F12` or `Ctrl+Shift+I` to open Chrome DevTools in the Electron window.

## Testing

### Unit Tests

Run unit tests with Vitest:
```bash
npm run test
```

Watch mode:
```bash
npm run test -- --watch
```

### E2E Tests

Run end-to-end tests with Playwright:
```bash
npm run test:e2e
```

With UI mode:
```bash
npm run test:e2e -- --ui
```

## Building for Production

### Development Build

Build without packaging:
```bash
npm run build
```

### Platform-Specific Builds

**Windows**:
```bash
npm run build:electron -- --win
```

**macOS**:
```bash
npm run build:electron -- --mac
```

**Linux**:
```bash
npm run build:electron -- --linux
```

## Configuration

### Vite Configuration

Edit `vite.config.ts` to customize the build process:
- Change port
- Add plugins
- Configure build options

### Electron Builder

Edit `package.json` under the `build` section to customize packaging:
- Change app icon
- Modify installer options
- Add auto-updater configuration

## State Management

This app uses Zustand for state management. Stores are located in `src/store/`:

**FolderStore**: Manages folder tree and selection
**PromptStore**: Manages prompts and CRUD operations
**UIStore**: Manages UI state (modals, loading, etc.)

Example usage:
```typescript
import { usePromptStore } from './store/promptStore';

const MyComponent = () => {
  const prompts = usePromptStore(state => state.prompts);
  const fetchPrompts = usePromptStore(state => state.fetchPrompts);

  // Use prompts and actions
};
```

## API Integration

The app communicates with the FastAPI backend at `http://localhost:8000`.

API configuration is in `src/services/api.ts`. Change the base URL there if needed.

## Styling

This app uses CSS Modules for component-specific styles.

**Component styles**: `ComponentName.module.css`
**Global styles**: `src/styles/index.css`

## Icons

Using Lucide React for icons. Import like:
```typescript
import { Folder, File, Copy, Edit } from 'lucide-react';
```

## Troubleshooting

### Electron Won't Start

- Ensure backend server is running at http://localhost:8000
- Check console for errors
- Try deleting `node_modules` and reinstalling: `npm install`

### HMR Not Working

- Check Vite dev server is running
- Ensure browser cache is cleared
- Try restarting dev server

### Build Failures

- Ensure all dependencies are installed
- Check Node.js version (18+)
- Clear build cache: `rm -rf dist` then rebuild

### Type Errors

- Run `npm run lint` to see all type errors
- Ensure TypeScript version is compatible
- Check `tsconfig.json` configuration

## Performance Optimization

### React.memo

Use React.memo for expensive components:
```typescript
export const PromptCard = React.memo(({ prompt }) => {
  // Component logic
});
```

### useMemo and useCallback

Optimize re-renders with React hooks:
```typescript
const sortedPrompts = useMemo(() =>
  prompts.sort((a, b) => a.title.localeCompare(b.title)),
  [prompts]
);

const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### Code Splitting

Lazy load routes and heavy components:
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

## Keyboard Shortcuts

Implemented shortcuts (see `src/hooks/useKeyboardShortcuts.ts`):

- `Ctrl+N` - New prompt
- `Ctrl+F` - Search
- `Ctrl+S` - Save (in modal)
- `Esc` - Close modal
- `Delete` - Delete selected prompt
- `Ctrl+D` - Duplicate prompt
- `Arrow Keys` - Navigate
- `F1` - Show shortcuts help

## Contributing

See [ONBOARDING.md](../docs/ONBOARDING.md) for development guidelines.

## License

MIT
