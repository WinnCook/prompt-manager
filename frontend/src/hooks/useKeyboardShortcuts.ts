import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
}

/**
 * Hook to register global keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcuts to register
 * @param enabled - Whether shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore shortcuts when typing in inputs or textareas
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Allow ESC to work in inputs
        if (event.key !== 'Escape') {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlOrCmd = shortcut.ctrlOrCmd
          ? isMac
            ? event.metaKey
            : event.ctrlKey
          : true;

        const shift = shortcut.shift !== undefined ? event.shiftKey === shortcut.shift : true;
        const alt = shortcut.alt !== undefined ? event.altKey === shortcut.alt : true;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlOrCmd &&
          shift &&
          alt
        ) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Get the display text for a keyboard shortcut
 * @param shortcut - Keyboard shortcut
 * @returns Display text (e.g., "Ctrl+K" or "Cmd+K")
 */
export function getShortcutDisplay(shortcut: Pick<KeyboardShortcut, 'key' | 'ctrlOrCmd' | 'shift' | 'alt'>): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];

  if (shortcut.ctrlOrCmd) {
    parts.push(isMac ? 'Cmd' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push('Shift');
  }
  if (shortcut.alt) {
    parts.push('Alt');
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join('+');
}
