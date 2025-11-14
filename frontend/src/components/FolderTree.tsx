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
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingValue, setRenamingValue] = useState(folder.name);
  const [confirmMove, setConfirmMove] = useState<{ show: boolean; dragData: DragData | null; targetFolder: Folder | null }>({
    show: false,
    dragData: null,
    targetFolder: null,
  });

  const { selectedFolderId, setSelectedFolderId, showToast } = useUIStore();
  const { moveFolder, updateFolder, reorderFolder, loadFolders } = useFolderStore();
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

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setRenamingValue(folder.name);
  };

  const handleRenameSubmit = async () => {
    const trimmed = renamingValue.trim();
    if (!trimmed) {
      showToast('Folder name cannot be empty', 'error');
      return;
    }
    if (trimmed === folder.name) {
      setIsRenaming(false);
      return;
    }

    const result = await updateFolder(folder.id, { name: trimmed });
    if (result) {
      showToast('Folder renamed successfully', 'success');
      await loadFolders();
      setIsRenaming(false);
    } else {
      showToast('Failed to rename folder', 'error');
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setRenamingValue(folder.name);
    }
  };

  const handleRenameBlur = () => {
    handleRenameSubmit();
  };

  // Helper to get all folders recursively
  const getAllFoldersFlat = (folders: Folder[]): Folder[] => {
    const result: Folder[] = [];
    for (const f of folders) {
      result.push(f);
      if (f.children && f.children.length > 0) {
        result.push(...getAllFoldersFlat(f.children));
      }
    }
    return result;
  };

  const handleMoveUp = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Get all folders flat
    const flatFolders = getAllFoldersFlat(allFolders);

    // Find parent folder to get siblings
    let siblings: Folder[];
    if (folder.parent_id === null) {
      // Root level siblings
      siblings = allFolders;
    } else {
      // Find parent and get its children
      const parent = flatFolders.find(f => f.id === folder.parent_id);
      siblings = parent?.children || [];
    }

    const currentIndex = siblings.findIndex(f => f.id === folder.id);
    if (currentIndex <= 0) {
      showToast('Folder is already at the top', 'info');
      return;
    }

    const result = await reorderFolder(folder.id, currentIndex - 1, folder.parent_id);
    if (result) {
      showToast('Folder moved up', 'success');
    } else {
      showToast('Failed to reorder folder', 'error');
    }
  };

  const handleMoveDown = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Get all folders flat
    const flatFolders = getAllFoldersFlat(allFolders);

    // Find parent folder to get siblings
    let siblings: Folder[];
    if (folder.parent_id === null) {
      // Root level siblings
      siblings = allFolders;
    } else {
      // Find parent and get its children
      const parent = flatFolders.find(f => f.id === folder.parent_id);
      siblings = parent?.children || [];
    }

    const currentIndex = siblings.findIndex(f => f.id === folder.id);
    if (currentIndex < 0 || currentIndex >= siblings.length - 1) {
      showToast('Folder is already at the bottom', 'info');
      return;
    }

    const result = await reorderFolder(folder.id, currentIndex + 1, folder.parent_id);
    if (result) {
      showToast('Folder moved down', 'success');
    } else {
      showToast('Failed to reorder folder', 'error');
    }
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

      // For folders, check if already in this parent (same parent drop)
      if (dragData.type === 'folder') {
        const draggedFolder = findFolderById(dragData.id, allFolders);
        if (draggedFolder && draggedFolder.parent_id === folder.id) {
          showToast('Folder is already in this location', 'info');
          return;
        }
      }

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
          {isRenaming ? (
            <input
              type="text"
              className="folder-name-input"
              value={renamingValue}
              onChange={(e) => setRenamingValue(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              onBlur={handleRenameBlur}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="folder-name">{folder.name}</span>
          )}
          {!isRenaming && isSelected && (
            <div className="folder-actions">
              <button className="folder-action-btn" onClick={handleMoveUp} title="Move folder up">
                ▲
              </button>
              <button className="folder-action-btn" onClick={handleMoveDown} title="Move folder down">
                ▼
              </button>
              <button className="folder-action-btn" onClick={handleRenameClick} title="Rename folder">
                ✏️
              </button>
            </div>
          )}
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
