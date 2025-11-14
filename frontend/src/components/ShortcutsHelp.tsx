import { getShortcutDisplay } from '@/hooks/useKeyboardShortcuts';
import './ShortcutsHelp.css';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutInfo {
  keys: string;
  description: string;
  category: string;
}

export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  if (!isOpen) return null;

  const shortcuts: ShortcutInfo[] = [
    // Navigation
    { keys: getShortcutDisplay({ key: 'K', ctrlOrCmd: true }), description: 'Open command palette', category: 'Navigation' },
    { keys: getShortcutDisplay({ key: 'F', ctrlOrCmd: true }), description: 'Focus search bar', category: 'Navigation' },
    { keys: '?', description: 'Show keyboard shortcuts', category: 'Navigation' },

    // Actions
    { keys: getShortcutDisplay({ key: 'N', ctrlOrCmd: true }), description: 'New prompt in current folder', category: 'Actions' },
    { keys: getShortcutDisplay({ key: 'D', ctrlOrCmd: true }), description: 'Duplicate selected prompt', category: 'Actions' },
    { keys: 'Enter', description: 'Edit selected prompt', category: 'Actions' },
    { keys: 'Delete', description: 'Delete selected prompt', category: 'Actions' },

    // General
    { keys: 'Esc', description: 'Close modal / Clear search', category: 'General' },
  ];

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div className="shortcuts-help-overlay" onClick={onClose}>
      <div className="shortcuts-help" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-help-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="shortcuts-help-content">
          {categories.map(category => (
            <div key={category} className="shortcuts-category">
              <h3>{category}</h3>
              <div className="shortcuts-list">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <kbd className="shortcut-keys">{shortcut.keys}</kbd>
                      <span className="shortcut-description">{shortcut.description}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="shortcuts-help-footer">
          <p>Press <kbd>?</kbd> to toggle this dialog</p>
        </div>
      </div>
    </div>
  );
}
