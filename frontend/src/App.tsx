import { useEffect } from 'react'
import './App.css'
import { useFolderStore, usePromptStore, useUIStore } from './store'
import { FolderTree, PromptGrid, EditModal, NewFolderButton } from './components'
import type { Prompt } from './types/api'

function App() {
  // Zustand stores
  const { folders, loading, error, loadFolders, createFolder } = useFolderStore()
  const { prompts, loadPrompts, duplicatePrompt, deletePrompt, movePrompt } = usePromptStore()
  const { selectedFolderId, openEditModal, showToast } = useUIStore()

  // Load folders on mount
  useEffect(() => {
    loadFolders()
  }, [loadFolders])

  // Load prompts when folder is selected
  useEffect(() => {
    if (selectedFolderId !== null) {
      loadPrompts({ folder_id: selectedFolderId })
    }
  }, [selectedFolderId, loadPrompts])

  // Action handlers
  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      showToast('Copied to clipboard!', 'success')
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error')
    }
  }

  const handleEdit = (prompt: Prompt) => {
    openEditModal(prompt.id)
  }

  const handleDuplicate = async (prompt: Prompt) => {
    const result = await duplicatePrompt(prompt.id)
    if (result) {
      showToast('Prompt duplicated successfully', 'success')
    } else {
      showToast('Failed to duplicate prompt', 'error')
    }
  }

  const handleDelete = async (prompt: Prompt) => {
    if (window.confirm(`Are you sure you want to delete "${prompt.title}"?`)) {
      const success = await deletePrompt(prompt.id)
      if (success) {
        showToast('Prompt deleted successfully', 'success')
      } else {
        showToast('Failed to delete prompt', 'error')
      }
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Prompt Manager</h1>
      </header>
      <main className="app-main">
        <div className="sidebar">
          <h2>Folders</h2>
          {!loading && !error && <NewFolderButton />}
          {loading && <p>Loading folders...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && !error && <FolderTree folders={folders} />}
        </div>
        <div className="content">
          <div className="content-header">
            <h2>Prompts</h2>
            {selectedFolderId !== null && (
              <button
                className="btn-primary"
                onClick={() => openEditModal()}
              >
                + New Prompt
              </button>
            )}
          </div>
          {selectedFolderId === null ? (
            <p>Select a folder to view prompts</p>
          ) : (
            <PromptGrid
              prompts={prompts}
              onCopy={handleCopy}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
      <EditModal />
    </div>
  )
}

export default App
