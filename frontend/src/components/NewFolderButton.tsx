import { useState } from 'react';
import { useFolderStore, useUIStore } from '@/store';
import './NewFolderButton.css';

export function NewFolderButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { createFolder } = useFolderStore();
  const { selectedFolderId, showToast } = useUIStore();

  const handleStartAdd = () => {
    setIsAdding(true);
    setFolderName('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFolderName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = folderName.trim();
    if (!trimmedName) {
      showToast('Folder name is required', 'error');
      return;
    }

    const result = await createFolder({
      name: trimmedName,
      parent_id: selectedFolderId,
    });

    if (result) {
      showToast('Folder created successfully', 'success');
      setIsAdding(false);
      setFolderName('');
    } else {
      showToast('Failed to create folder', 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="new-folder-form">
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Folder name..."
          autoFocus
          className="new-folder-input"
        />
        <div className="new-folder-actions">
          <button type="submit" className="btn-folder-add">
            ✓
          </button>
          <button type="button" onClick={handleCancel} className="btn-folder-cancel">
            ✕
          </button>
        </div>
      </form>
    );
  }

  return (
    <button onClick={handleStartAdd} className="btn-new-folder">
      + New Folder
    </button>
  );
}
