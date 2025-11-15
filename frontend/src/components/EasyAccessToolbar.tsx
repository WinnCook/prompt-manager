import { usePromptStore, useUIStore } from '@/store';
import { hasVariables } from '@/utils/variables';
import { useState, useEffect } from 'react';
import type { Prompt } from '@/types/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  pointerWithin,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './EasyAccessToolbar.css';
import promptApi from '@/services/promptApi';

interface SortablePromptButtonProps {
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
}

function SortablePromptButton({ prompt, onCopy }: SortablePromptButtonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: prompt.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="toolbar-prompt-btn"
      onClick={(e) => {
        // Only trigger copy if not dragging
        if (!isDragging) {
          onCopy(prompt);
        }
      }}
      title={`Click to copy: ${prompt.title}\n\n${prompt.description || 'No description'}\n\nDrag to reorder`}
    >
      <span className="prompt-title">{prompt.title}</span>
      {hasVariables(prompt.content) && <span className="has-vars">📝</span>}
      {prompt.is_ai_enhanced && <span className="ai-badge">✨</span>}
    </button>
  );
}

export function EasyAccessToolbar() {
  const { easyAccessPrompts, setEasyAccessPrompts } = usePromptStore();
  const { showToast } = useUIStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  // Suppress popup.js errors from browser extensions
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('popup.js')) return;
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Lower threshold for more responsive drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = easyAccessPrompts.findIndex((p) => p.id === active.id);
    const newIndex = easyAccessPrompts.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update UI immediately
    const newPrompts = arrayMove(easyAccessPrompts, oldIndex, newIndex);
    setEasyAccessPrompts(newPrompts);

    try {
      // Send reorder request to backend
      const response = await promptApi.reorderEasyAccess(active.id as number, newIndex);

      if (response.success && response.data) {
        // Confirm with server data
        setEasyAccessPrompts(response.data.prompts);
      } else {
        // Rollback on error
        const reloadResponse = await promptApi.getEasyAccessPrompts();
        if (reloadResponse.success && reloadResponse.data) {
          setEasyAccessPrompts(reloadResponse.data.prompts);
        }
        showToast('Failed to reorder', 'error');
      }
    } catch (error) {
      // Rollback on error - reload fresh data
      try {
        const reloadResponse = await promptApi.getEasyAccessPrompts();
        if (reloadResponse.success && reloadResponse.data) {
          setEasyAccessPrompts(reloadResponse.data.prompts);
        }
      } catch (reloadError) {
        console.error('Failed to reload prompts:', reloadError);
      }
      showToast('Failed to reorder', 'error');
      console.error('Reorder error:', error);
    }
  };

  if (easyAccessPrompts.length === 0) {
    return null;
  }

  const activePrompt = easyAccessPrompts.find((p) => p.id === activeId);

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
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={easyAccessPrompts.map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="toolbar-prompts">
              {easyAccessPrompts.map((prompt) => (
                <SortablePromptButton
                  key={prompt.id}
                  prompt={prompt}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {activePrompt ? (
              <div className="toolbar-prompt-btn dragging-overlay">
                <span className="prompt-title">{activePrompt.title}</span>
                {hasVariables(activePrompt.content) && <span className="has-vars">📝</span>}
                {activePrompt.is_ai_enhanced && <span className="ai-badge">✨</span>}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
