import { PromptCard } from './PromptCard';
import type { Prompt } from '@/types/api';
import './PromptGrid.css';

interface PromptGridProps {
  prompts: Prompt[];
  onCopy?: (prompt: Prompt) => void;
  onEdit?: (prompt: Prompt) => void;
  onDuplicate?: (prompt: Prompt) => void;
  onDelete?: (prompt: Prompt) => void;
  onEnhance?: (prompt: Prompt) => void;
  onToggleEasyAccess?: (prompt: Prompt, enable: boolean) => void;
}

export function PromptGrid({
  prompts,
  onCopy,
  onEdit,
  onDuplicate,
  onDelete,
  onEnhance,
  onToggleEasyAccess,
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="prompt-grid-empty">
        <p>No prompts in this folder yet.</p>
        <p className="empty-hint">Create your first prompt to get started!</p>
      </div>
    );
  }

  return (
    <div className="prompt-grid">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onCopy={onCopy}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onEnhance={onEnhance}
          onToggleEasyAccess={onToggleEasyAccess}
        />
      ))}
    </div>
  );
}
