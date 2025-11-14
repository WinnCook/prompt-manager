import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import type { Prompt } from '@/types/api';
import { promptApi } from '@/services';
import { useUIStore } from '@/store';
import './PromptList.css';

interface PromptListProps {
  prompts: Prompt[];
  folderId: number | null;
  onCopy: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
  onEnhance: (prompt: Prompt) => void;
  onReorderComplete?: () => void;
}

/**
 * PromptList Component
 *
 * Container for list view with drag-and-drop reordering.
 * Uses @dnd-kit for accessible, smooth drag-and-drop.
 */
export const PromptList = ({
  prompts,
  folderId,
  onCopy,
  onEdit,
  onDelete,
  onEnhance,
  onReorderComplete,
}: PromptListProps) => {
  const [items, setItems] = useState(prompts);
  const { showToast } = useUIStore();

  // Update items when prompts prop changes
  useEffect(() => {
    setItems(prompts);
  }, [prompts]);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start drag after moving 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !folderId) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update UI
    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    setItems(reorderedItems);

    try {
      // Call API to persist reorder
      const result = await promptApi.reorder({
        prompt_id: active.id as number,
        new_position: newIndex,
        folder_id: folderId,
      });

      if (result.data) {
        // Update with server response
        setItems(result.data.prompts);
        showToast('Prompt reordered successfully', 'success');
        if (onReorderComplete) {
          onReorderComplete();
        }
      } else {
        // Rollback on error
        setItems(items);
        showToast('Failed to reorder prompt', 'error');
      }
    } catch (error) {
      // Rollback on error
      setItems(items);
      showToast(`Error reordering: ${error}`, 'error');
      console.error('[Reorder Error]', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="prompt-list-empty">
        <p>No prompts in this folder</p>
        <p className="empty-hint">Click "+ New Prompt" to create one</p>
      </div>
    );
  }

  return (
    <div className="prompt-list">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((prompt) => (
            <SortableItem
              key={prompt.id}
              id={prompt.id}
              prompt={prompt}
              onCopy={onCopy}
              onEdit={onEdit}
              onDelete={onDelete}
              onEnhance={onEnhance}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PromptList;
