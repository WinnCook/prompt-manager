import { useState } from 'react';
import { useFolderStore, useUIStore } from '@/store';
import { promptApi } from '@/services';
import { ConfirmDialog } from './ConfirmDialog';
import type { Folder } from '@/types/api';
import './DeleteFolderButton.css';

interface DeleteStats {
  subfolderCount: number;
  totalPrompts: number;
}

export function DeleteFolderButton() {
  const { selectedFolderId, showToast, setSelectedFolderId } = useUIStore();
  const { folders, deleteFolder, getFolderById } = useFolderStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteStats, setDeleteStats] = useState<DeleteStats>({ subfolderCount: 0, totalPrompts: 0 });
  const [isCalculating, setIsCalculating] = useState(false);

  // Recursively count subfolders in a folder tree
  const countSubfolders = (folder: Folder): number => {
    if (!folder.children || folder.children.length === 0) {
      return 0;
    }

    let count = folder.children.length;
    for (const child of folder.children) {
      count += countSubfolders(child);
    }
    return count;
  };

  // Recursively get all folder IDs including the folder itself
  const getAllFolderIds = (folder: Folder): number[] => {
    const ids = [folder.id];
    if (folder.children) {
      for (const child of folder.children) {
        ids.push(...getAllFolderIds(child));
      }
    }
    return ids;
  };

  // Count all prompts in a folder and its subfolders
  const countPrompts = async (folder: Folder): Promise<number> => {
    const folderIds = getAllFolderIds(folder);
    let totalPrompts = 0;

    // Fetch prompts for each folder
    for (const folderId of folderIds) {
      const result = await promptApi.list({ folder_id: folderId, limit: 1000 });
      if (result.data) {
        totalPrompts += result.data.total;
      }
    }

    return totalPrompts;
  };

  const handleDeleteClick = async () => {
    if (selectedFolderId === null) return;

    const folder = getFolderById(selectedFolderId);
    if (!folder) {
      showToast('Folder not found', 'error');
      return;
    }

    setIsCalculating(true);

    try {
      // Calculate stats
      const subfolderCount = countSubfolders(folder);
      const totalPrompts = await countPrompts(folder);

      setDeleteStats({ subfolderCount, totalPrompts });
      setShowConfirm(true);
    } catch (err) {
      showToast('Failed to calculate folder contents', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  const performDelete = async () => {
    if (selectedFolderId === null) return;

    const folder = getFolderById(selectedFolderId);
    if (!folder) return;

    const success = await deleteFolder(selectedFolderId);

    if (success) {
      showToast(`Folder "${folder.name}" deleted successfully`, 'success');
      setSelectedFolderId(null);
    } else {
      showToast('Failed to delete folder', 'error');
    }

    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const selectedFolder = selectedFolderId !== null ? getFolderById(selectedFolderId) : null;

  const getMessage = () => {
    if (!selectedFolder) return '';

    const parts = ['Are you sure you want to delete'];

    // "1 folder"
    parts.push('1 folder');

    // "n subfolders" (if any)
    if (deleteStats.subfolderCount > 0) {
      parts.push(`${deleteStats.subfolderCount} ${deleteStats.subfolderCount === 1 ? 'subfolder' : 'subfolders'}`);
    }

    // "and X total files"
    if (deleteStats.totalPrompts > 0) {
      const connector = deleteStats.subfolderCount > 0 ? 'and' : '';
      parts.push(`${connector} ${deleteStats.totalPrompts} total ${deleteStats.totalPrompts === 1 ? 'file' : 'files'}`);
    }

    return parts.join(', ').replace(', and', ' and') + '?';
  };

  // Hide button if root folder (ID 1) is somehow selected
  if (selectedFolderId === null || selectedFolderId === 1) {
    return null;
  }

  return (
    <>
      <div className="delete-folder-button-container">
        <button
          className="btn-delete-folder"
          onClick={handleDeleteClick}
          disabled={isCalculating}
        >
          {isCalculating ? 'Calculating...' : '🗑️ Delete Folder'}
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Folder"
        message={getMessage()}
        onConfirm={performDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
