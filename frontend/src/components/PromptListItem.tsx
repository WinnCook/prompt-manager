import { Copy, Edit, Trash2, Sparkles, MoreVertical, Star } from 'lucide-react';
import type { Prompt } from '@/types/api';
import './PromptListItem.css';

interface PromptListItemProps {
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
  onEnhance: (prompt: Prompt) => void;
  onToggleEasyAccess?: (prompt: Prompt, enable: boolean) => void;
  isDragging?: boolean;
}

/**
 * PromptListItem Component
 *
 * Displays a single prompt as a row in list view.
 * Shows: drag handle | title | preview | action buttons
 */
export const PromptListItem = ({
  prompt,
  onCopy,
  onEdit,
  onDelete,
  onEnhance,
  onToggleEasyAccess,
  isDragging = false,
}: PromptListItemProps) => {
  // Truncate content preview
  const contentPreview = prompt.content.length > 150
    ? prompt.content.substring(0, 150) + '...'
    : prompt.content;

  const handleTitleClick = () => {
    onCopy(prompt);
  };

  return (
    <div
      className={`prompt-list-item ${isDragging ? 'dragging' : ''}`}
      data-prompt-id={prompt.id}
    >
      {/* Drag Handle */}
      <div className="drag-handle" title="Drag to reorder">
        <MoreVertical size={16} />
      </div>

      {/* Title - clickable to copy */}
      <div className="prompt-title" onClick={handleTitleClick} title="Click to copy">
        {prompt.title}
        {prompt.is_ai_enhanced && (
          <span className="ai-badge" title="AI Enhanced">
            <Sparkles size={14} />
          </span>
        )}
      </div>

      {/* Content Preview */}
      <div className="prompt-preview" title={prompt.content}>
        {contentPreview}
      </div>

      {/* Action Buttons */}
      <div className="prompt-actions">
        <button
          className={`action-btn easy-access-btn ${prompt.is_easy_access ? 'active' : ''}`}
          onClick={() => onToggleEasyAccess?.(prompt, !prompt.is_easy_access)}
          title={prompt.is_easy_access ? "Remove from Easy Access" : "Add to Easy Access"}
          aria-label="Easy Access"
        >
          <Star size={16} fill={prompt.is_easy_access ? 'currentColor' : 'none'} />
        </button>
        <button
          className="action-btn"
          onClick={() => onCopy(prompt)}
          title="Copy to clipboard"
          aria-label="Copy"
        >
          <Copy size={16} />
        </button>
        <button
          className="action-btn"
          onClick={() => onEdit(prompt)}
          title="Edit prompt"
          aria-label="Edit"
        >
          <Edit size={16} />
        </button>
        <button
          className="action-btn enhance-btn"
          onClick={() => onEnhance(prompt)}
          title="Enhance with AI"
          aria-label="Enhance"
        >
          <Sparkles size={16} />
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(prompt)}
          title="Delete prompt"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PromptListItem;
