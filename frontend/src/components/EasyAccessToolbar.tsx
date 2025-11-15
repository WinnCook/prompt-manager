import { usePromptStore, useUIStore } from '@/store';
import { hasVariables } from '@/utils/variables';
import { useState } from 'react';
import type { Prompt } from '@/types/api';
import './EasyAccessToolbar.css';

export function EasyAccessToolbar() {
  const { easyAccessPrompts } = usePromptStore();
  const { showToast } = useUIStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleCopy = async (prompt: Prompt) => {
    if (hasVariables(prompt.content)) {
      showToast('This prompt has variables - use the main view to fill them', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt.content);
      showToast(`Copied "${prompt.title}" to clipboard!`, 'success');
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  if (easyAccessPrompts.length === 0) {
    return null; // Don't show toolbar if no easy access prompts
  }

  return (
    <div className={`easy-access-toolbar ${isMinimized ? 'minimized' : ''}`}>
      <button
        className="toolbar-toggle"
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? 'Expand Quick Access' : 'Minimize Quick Access'}
      >
        {isMinimized ? '▲' : '▼'} Quick Access ({easyAccessPrompts.length})
      </button>

      {!isMinimized && (
        <div className="toolbar-prompts">
          {easyAccessPrompts.map((prompt) => (
            <button
              key={prompt.id}
              className="toolbar-prompt-btn"
              onClick={() => handleCopy(prompt)}
              title={`Click to copy: ${prompt.title}\n\n${prompt.description || 'No description'}`}
            >
              <span className="prompt-title">{prompt.title}</span>
              {hasVariables(prompt.content) && <span className="has-vars">📝</span>}
              {prompt.is_ai_enhanced && <span className="ai-badge">✨</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
