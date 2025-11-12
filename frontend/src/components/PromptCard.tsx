import { useState } from 'react';
import type { Prompt } from '@/types/api';
import './PromptCard.css';

interface PromptCardProps {
  prompt: Prompt;
  onCopy?: (prompt: Prompt) => void;
  onEdit?: (prompt: Prompt) => void;
  onDuplicate?: (prompt: Prompt) => void;
  onDelete?: (prompt: Prompt) => void;
}

export function PromptCard({
  prompt,
  onCopy,
  onEdit,
  onDuplicate,
  onDelete,
}: PromptCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className="prompt-card"
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="prompt-card-header">
        <h3 className="prompt-title">{prompt.title}</h3>
        {isHovered && (
          <div className="prompt-actions">
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
          </div>
        )}
      </div>

      {prompt.description && (
        <p className="prompt-description">{prompt.description}</p>
      )}

      <div className="prompt-content">
        <pre className="prompt-text">{prompt.content}</pre>
      </div>

      <div className="prompt-footer">
        <div className="prompt-metadata">
          <span className="prompt-version">v{prompt.version}</span>
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
