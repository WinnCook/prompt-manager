import { useState, useEffect, useRef } from 'react';
import { useFolderStore, usePromptStore, useUIStore } from '@/store';
import { promptApi } from '@/services';
import type { Prompt } from '@/types/api';
import './CommandPalette.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  type: 'action' | 'prompt' | 'folder';
  label: string;
  subtitle?: string;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { folders, getFolderById } = useFolderStore();
  const { openEditModal, setSelectedFolderId } = useUIStore();

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 50);

      // Load initial commands
      loadCommands('');
    } else {
      // Reset when closed
      setQuery('');
      setCommands([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    loadCommands(query);
    setSelectedIndex(0);
  }, [query]);

  const loadCommands = async (searchQuery: string) => {
    const allCommands: Command[] = [];

    // Static actions
    allCommands.push({
      id: 'new-prompt',
      type: 'action',
      label: 'New Prompt',
      subtitle: 'Create a new prompt in current folder',
      action: () => {
        openEditModal();
        onClose();
      },
    });

    allCommands.push({
      id: 'help',
      type: 'action',
      label: 'Show Keyboard Shortcuts',
      subtitle: 'View all available shortcuts',
      action: () => {
        // Will be implemented with help dialog
        onClose();
      },
    });

    // Search prompts if query exists
    if (searchQuery.trim()) {
      const result = await promptApi.search(searchQuery, { limit: 10 });
      if (result.data) {
        result.data.prompts.forEach((prompt: Prompt) => {
          const folder = getFolderById(prompt.folder_id);
          allCommands.push({
            id: `prompt-${prompt.id}`,
            type: 'prompt',
            label: prompt.title,
            subtitle: folder?.path || 'Unknown folder',
            action: () => {
              openEditModal(prompt.id);
              onClose();
            },
          });
        });
      }
    }

    // Add folders
    const flattenFolders = (folders: typeof folders): any[] => {
      return folders.flatMap(folder => [
        folder,
        ...flattenFolders(folder.children || [])
      ]);
    };

    flattenFolders(folders).forEach(folder => {
      if (!searchQuery || folder.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        allCommands.push({
          id: `folder-${folder.id}`,
          type: 'folder',
          label: folder.name,
          subtitle: `Go to ${folder.path}`,
          action: () => {
            setSelectedFolderId(folder.id);
            onClose();
          },
        });
      }
    });

    setCommands(allCommands);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, commands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && commands[selectedIndex]) {
      e.preventDefault();
      commands[selectedIndex].action();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'action':
        return '⚡';
      case 'prompt':
        return '📝';
      case 'folder':
        return '📁';
      default:
        return '•';
    }
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-search">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="command-palette-results">
          {commands.length === 0 ? (
            <div className="command-empty">No commands found</div>
          ) : (
            commands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => cmd.action()}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="command-icon">{getIcon(cmd.type)}</span>
                <div className="command-content">
                  <div className="command-label">{cmd.label}</div>
                  {cmd.subtitle && (
                    <div className="command-subtitle">{cmd.subtitle}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="command-palette-footer">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
