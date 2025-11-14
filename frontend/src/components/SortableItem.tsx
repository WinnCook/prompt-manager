import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PromptListItem } from './PromptListItem';
import type { Prompt } from '@/types/api';

interface SortableItemProps {
  id: number;
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
  onEnhance: (prompt: Prompt) => void;
}

/**
 * SortableItem Component
 *
 * Wrapper around PromptListItem that makes it draggable using @dnd-kit.
 * Handles drag state and transforms.
 */
export const SortableItem = ({
  id,
  prompt,
  onCopy,
  onEdit,
  onDelete,
  onEnhance,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PromptListItem
        prompt={prompt}
        onCopy={onCopy}
        onEdit={onEdit}
        onDelete={onDelete}
        onEnhance={onEnhance}
        isDragging={isDragging}
      />
    </div>
  );
};

export default SortableItem;
