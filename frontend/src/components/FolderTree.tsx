import { useState } from 'react';
import { useUIStore, useFolderStore, usePromptStore } from '@/store';
import { ConfirmDialog } from './ConfirmDialog';
import type { Folder } from '@/types/api';
import './FolderTree.css';

interface DragData {
  type: 'folder' | 'prompt';
  id: number;
  name: string;
}

interface FolderTreeItemProps {
  folder: Folder;
  level?: number;
  allFolders: Folder[];
}

function FolderTreeItem({ folder, level = 0, allFolders }: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [confirmMove, setConfirmMove] = useState<{ show: boolean; dragData: DragData | null; targetFolder: Folder | null }>({
    show: false,
    dragData: null,
    targetFolder: null,
  });

  const { selectedFolderId, setSelectedFolderId, showToast } = useUIStore();
  const { moveFolder, loadFolders } = useFolderStore();
  const { movePrompt, loadPrompts } = usePromptStore();

  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    setSelectedFolderId(folder.id);
  };

  // Find a folder by ID in the tree
  const findFolderById = (folderId: number, folders: Folder[]): Folder | null => {
    for (const f of folders) {
      if (f.id === folderId) return f;
      if (f.children) {
        const found = findFolderById(folderId, f.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Check if targetFolder is a descendant of sourceFolder
  const isDescendantOf = (targetFolderId: number, sourceFolder: Folder): boolean => {
    if (sourceFolder.id === targetFolderId) return true;
    if (!sourceFolder.children) return false;

    for (const child of sourceFolder.children) {
      if (isDescendantOf(targetFolderId, child)) return true;
    }
    return false;
  };

  // Drag handlers for folders
  const handleDragStart = (e: React.DragEvent) => {
    const dragData: DragData = {
      type: 'folder',
      id: folder.id,
      name: folder.name,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const dragData: DragData = JSON.parse(data);

      // Prevent dropping folder on itself
      if (dragData.type === 'folder' && dragData.id === folder.id) {
        showToast('Cannot move folder into itself', 'error');
        return;
      }

      // For folders, check if target is a descendant of dragged folder
      if (dragData.type === 'folder') {
        const draggedFolder = findFolderById(dragData.id, allFolders);
        if (draggedFolder && isDescendantOf(folder.id, draggedFolder)) {
          showToast('Cannot move folder into its own descendant', 'error');
          return;
        }
      }

      // Show confirmation for both prompts AND folders
      setConfirmMove({
        show: true,
        dragData,
        targetFolder: folder,
      });
    } catch (err) {
      showToast('Failed to process drop', 'error');
    }
  };

  const performMove = async () => {
    if (!confirmMove.dragData || !confirmMove.targetFolder) return;

    if (confirmMove.dragData.type === 'folder') {
      // Move folder
      const result = await moveFolder(confirmMove.dragData.id, confirmMove.targetFolder.id);
      if (result) {
        showToast('Folder moved successfully', 'success');
        await loadFolders();
      } else {
        showToast('Failed to move folder', 'error');
      }
    } else {
      // Move prompt
      const result = await movePrompt(confirmMove.dragData.id, confirmMove.targetFolder.id);
      if (result) {
        showToast('Prompt moved successfully', 'success');
        if (selectedFolderId !== null) {
          await loadPrompts({ folder_id: selectedFolderId });
        }
      } else {
        showToast('Failed to move prompt', 'error');
      }
    }

    setConfirmMove({ show: false, dragData: null, targetFolder: null });
  };

  const cancelMove = () => {
    setConfirmMove({ show: false, dragData: null, targetFolder: null });
  };

  return (
    <>
      <div className="folder-tree-item">
        <div
          className={`folder-item ${isSelected ? 'selected' : ''} ${isSelected && isExpanded ? 'expanded' : ''} ${isDragOver ? 'drag-over' : ''}`}
          style={{ paddingLeft: `${level * 1.25}rem` }}
          onClick={handleSelect}
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            className="expand-button"
            onClick={handleToggle}
            style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span className="folder-icon">📁</span>
          <span className="folder-name">{folder.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="folder-children">
            {folder.children.map((child) => (
              <FolderTreeItem
                key={child.id}
                folder={child}
                level={level + 1}
                allFolders={allFolders}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmMove.show}
        title={confirmMove.dragData?.type === 'folder' ? 'Move Folder' : 'Move Prompt'}
        message={`Are you sure you want to move "${confirmMove.dragData?.name}" to "${confirmMove.targetFolder?.name}"?`}
        onConfirm={performMove}
        onCancel={cancelMove}
      />
    </>
  );
}

interface FolderTreeProps {
  folders: Folder[];
}

export function FolderTree({ folders }: FolderTreeProps) {
  return (
    <div className="folder-tree">
      {folders.map((folder) => (
        <FolderTreeItem key={folder.id} folder={folder} allFolders={folders} />
      ))}
    </div>
  );
}
