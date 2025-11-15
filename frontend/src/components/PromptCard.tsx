import { useState } from 'react';
import type { Prompt } from '@/types/api';
import { hasVariables } from '@/utils/variables';
import './PromptCard.css';

interface PromptCardProps {
  prompt: Prompt;
  onCopy?: (prompt: Prompt) => void;
  onEdit?: (prompt: Prompt) => void;
  onDuplicate?: (prompt: Prompt) => void;
  onDelete?: (prompt: Prompt) => void;
  onEnhance?: (prompt: Prompt) => void;
  onToggleEasyAccess?: (prompt: Prompt, enable: boolean) => void;
}

export function PromptCard({
  prompt,
  onCopy,
  onEdit,
  onDuplicate,
  onDelete,
  onEnhance,
  onToggleEasyAccess,
}: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAiHovered, setIsAiHovered] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy?.(prompt);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(prompt);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.(prompt);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(prompt);
  };

  const handleEnhance = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEnhance?.(prompt);
  };

  const handleToggleEasyAccess = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleEasyAccess?.(prompt, !prompt.is_easy_access);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    const dragData = {
      type: 'prompt',
      id: prompt.id,
      name: prompt.title,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const hasVars = hasVariables(prompt.content);

  const handleCardClick = () => {
    // Copy to clipboard when card is clicked
    onCopy?.(prompt);
  };

  return (
    <div
      className="prompt-card"
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="prompt-card-header">
        <h3 className="prompt-title">
          {prompt.title}
          {hasVars && <span className="variable-indicator" title="Contains variables">🎯</span>}
        </h3>
        <div className="prompt-actions">
          {/* Star is always visible */}
          <button
            className={`action-button easy-access ${prompt.is_easy_access ? 'active' : ''}`}
            onClick={handleToggleEasyAccess}
            title={prompt.is_easy_access ? "Remove from Easy Access" : "Add to Easy Access"}
          >
            {prompt.is_easy_access ? '⭐' : '☆'}
          </button>
          {/* Other actions only show on hover */}
          {isHovered && (
            <>
              <button
                className="action-button copy"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                📋
              </button>
              <button
                className="action-button edit"
                onClick={handleEdit}
                title="Edit prompt"
              >
                ✏️
              </button>
              <button
                className="action-button duplicate"
                onClick={handleDuplicate}
                title="Duplicate prompt"
              >
                📑
              </button>
              <button
                className="action-button delete"
                onClick={handleDelete}
                title="Delete prompt"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {prompt.description && (
        <p className="prompt-description">{prompt.description}</p>
      )}

      <div className="prompt-content">
        <pre className="prompt-text">{prompt.content}</pre>
      </div>

      <div className="prompt-footer">
        <button
          className={`ai-enhance-button ${isAiHovered ? 'ai-hovered' : ''}`}
          onClick={handleEnhance}
          onMouseEnter={() => setIsAiHovered(true)}
          onMouseLeave={() => setIsAiHovered(false)}
          title="AI Enhance Prompt"
        >
          ✨
        </button>
        <div className="prompt-metadata">
          <span className="prompt-version">v{prompt.version || 1}</span>
          <span className="prompt-date">{formatDate(prompt.updated_at)}</span>
        </div>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="prompt-tags">
            {prompt.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
