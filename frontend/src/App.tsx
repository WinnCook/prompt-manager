import { useEffect, useState, useRef } from 'react'
import './App.css'
import { useFolderStore, usePromptStore, useUIStore } from './store'
import { FolderTree, PromptGrid, PromptList, EditModal, NewFolderButton, DeleteFolderButton, SearchBar, SearchResults, CommandPalette, ShortcutsHelp, VariableFillDialog, ViewToggle, ResizableDivider, ThemeToggle } from './components'
import { EnhanceCompareModal } from './components/EnhanceCompareModal'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { promptApi } from './services'
import { hasVariables } from './utils/variables'
import type { Prompt } from './types/api'

function App() {
  // Zustand stores
  const { folders, loading, error, loadFolders, createFolder } = useFolderStore()
  const { prompts, loadPrompts, duplicatePrompt, deletePrompt, movePrompt, toggleEasyAccess, loadEasyAccessPrompts } = usePromptStore()
  const { selectedFolderId, viewMode, openEditModal, showToast, sidebarWidth, theme, setTheme } = useUIStore()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Prompt[]>([])
  const [searchTotal, setSearchTotal] = useState(0)
  const [isSearching, setIsSearching] = useState(false)

  // Keyboard shortcuts state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Variables state
  const [variableFillDialog, setVariableFillDialog] = useState<{
    isOpen: boolean;
    content: string;
    promptTitle: string;
  }>({
    isOpen: false,
    content: '',
    promptTitle: '',
  })

  // AI Enhancement state
  const [enhanceModal, setEnhanceModal] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    promptId: number | null;
    original: string;
    enhanced: string;
    customInstruction: string;
  }>({
    isOpen: false,
    isLoading: false,
    promptId: null,
    original: '',
    enhanced: '',
    customInstruction: '',
  })

  // Initialize theme on mount
  useEffect(() => {
    // Apply theme to DOM
    const effectiveTheme = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Load folders and easy access prompts on mount
  useEffect(() => {
    loadFolders()
    loadEasyAccessPrompts()
  }, [loadFolders, loadEasyAccessPrompts])

  // Load prompts when folder is selected
  useEffect(() => {
    if (selectedFolderId !== null) {
      loadPrompts({ folder_id: selectedFolderId })
    }
  }, [selectedFolderId, loadPrompts])

  // Action handlers
  const handleCopy = async (prompt: Prompt) => {
    // Check if prompt has variables
    if (hasVariables(prompt.content)) {
      // Show variable fill dialog
      setVariableFillDialog({
        isOpen: true,
        content: prompt.content,
        promptTitle: prompt.title,
      })
    } else {
      // Copy directly
      try {
        await navigator.clipboard.writeText(prompt.content)
        showToast('Copied to clipboard!', 'success')
      } catch (err) {
        showToast('Failed to copy to clipboard', 'error')
      }
    }
  }

  const handleVariableFill = async (filledContent: string) => {
    try {
      await navigator.clipboard.writeText(filledContent)
      showToast('Copied to clipboard with variables filled!', 'success')
      setVariableFillDialog({ isOpen: false, content: '', promptTitle: '' })
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

  // AI Enhancement handlers
  const handleEnhance = async (prompt: Prompt) => {
    console.log('[Enhancement] Starting enhancement for prompt:', prompt.id)

    setEnhanceModal({
      isOpen: true,
      isLoading: true,
      promptId: prompt.id,
      original: prompt.content,
      enhanced: '',
      customInstruction: '',
    })

    try {
      // Call API to enhance
      console.log('[Enhancement] Calling API...')
      const result = await promptApi.enhance(prompt.id)
      console.log('[Enhancement] API Result:', result)

      if (result.data) {
        console.log('[Enhancement] Success! Setting enhanced content')
        setEnhanceModal(prev => ({
          ...prev,
          isLoading: false,
          original: result.data!.original,
          enhanced: result.data!.enhanced,
        }))
      } else {
        console.error('[Enhancement] No data in result:', result.error)
        showToast(result.error?.message || 'Failed to enhance prompt', 'error')
        setEnhanceModal({
          isOpen: false,
          isLoading: false,
          promptId: null,
          original: '',
          enhanced: '',
          customInstruction: '',
        })
      }
    } catch (error) {
      console.error('[Enhancement] Exception caught:', error)
      showToast(`Error: ${error}`, 'error')
      setEnhanceModal({
        isOpen: false,
        isLoading: false,
        promptId: null,
        original: '',
        enhanced: '',
        customInstruction: '',
      })
    }
  }

  const handleRegenerateEnhancement = async () => {
    if (!enhanceModal.promptId) return

    setEnhanceModal(prev => ({ ...prev, isLoading: true }))

    const result = await promptApi.enhance(
      enhanceModal.promptId,
      enhanceModal.customInstruction || undefined
    )

    if (result.data) {
      setEnhanceModal(prev => ({
        ...prev,
        isLoading: false,
        enhanced: result.data!.enhanced,
      }))
      showToast('Regenerated with custom instruction', 'success')
    } else {
      showToast('Failed to regenerate enhancement', 'error')
      setEnhanceModal(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleSelectOriginal = () => {
    // Keep original - just close modal
    showToast('Kept original prompt', 'success')
    setEnhanceModal({
      isOpen: false,
      isLoading: false,
      promptId: null,
      original: '',
      enhanced: '',
      customInstruction: '',
    })
  }

  const handleSelectEnhanced = async () => {
    if (!enhanceModal.promptId) return

    const result = await promptApi.applyEnhancement(
      enhanceModal.promptId,
      enhanceModal.enhanced
    )

    if (result.data) {
      showToast('Applied AI-enhanced version', 'success')
      // Reload prompts to show updated version
      if (selectedFolderId !== null) {
        loadPrompts({ folder_id: selectedFolderId })
      }
    } else {
      showToast('Failed to apply enhancement', 'error')
    }

    setEnhanceModal({
      isOpen: false,
      isLoading: false,
      promptId: null,
      original: '',
      enhanced: '',
      customInstruction: '',
    })
  }

  const handleEnhanceModalClose = () => {
    setEnhanceModal({
      isOpen: false,
      isLoading: false,
      promptId: null,
      original: '',
      enhanced: '',
      customInstruction: '',
    })
  }

  // Easy Access handler
  const handleToggleEasyAccess = async (prompt: Prompt, enable: boolean) => {
    console.log('[Easy Access] Toggling:', prompt.id, enable)
    const result = await toggleEasyAccess(prompt.id, enable)
    console.log('[Easy Access] Result:', result)
    if (result) {
      showToast(
        enable ? 'Added to Easy Access' : 'Removed from Easy Access',
        'success'
      )
      // Reload prompts to reflect the change
      if (selectedFolderId !== null) {
        loadPrompts({ folder_id: selectedFolderId })
      }
    } else {
      showToast('Failed to update Easy Access (max 8 allowed)', 'error')
    }
  }

  // Search handler
  const handleSearch = async (query: string) => {
    console.log('[Search] Query:', query);
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      setSearchTotal(0)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    console.log('[Search] Searching for:', query);
    const result = await promptApi.search(query)
    console.log('[Search] Results:', result);

    if (result.data) {
      setSearchResults(result.data.prompts)
      setSearchTotal(result.data.total)
      showToast(`Found ${result.data.total} result(s)`, 'success');
    } else {
      setSearchResults([])
      setSearchTotal(0)
      showToast('Search failed', 'error')
    }
  }

  // Handle selecting a search result
  const handleSearchResultSelect = (prompt: Prompt) => {
    openEditModal(prompt.id)
  }

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlOrCmd: true,
      handler: () => setIsCommandPaletteOpen(true),
      description: 'Open command palette',
    },
    {
      key: 'f',
      ctrlOrCmd: true,
      handler: () => {
        // Focus search input
        const searchInput = document.querySelector('.search-input') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      },
      description: 'Focus search',
    },
    {
      key: 'n',
      ctrlOrCmd: true,
      handler: () => {
        if (selectedFolderId !== null) {
          openEditModal()
        }
      },
      description: 'New prompt',
    },
    {
      key: '?',
      shift: true,
      handler: () => setIsShortcutsHelpOpen(true),
      description: 'Show keyboard shortcuts',
    },
  ])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Prompt Manager</h1>
          <div className="header-actions">
            <SearchBar onSearch={handleSearch} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="sidebar" style={{ width: `${sidebarWidth}px` }}>
          <div className="sidebar-content">
            <h2>Folders</h2>
            {!loading && !error && <NewFolderButton />}
            {loading && <p>Loading folders...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && <FolderTree folders={folders} />}
          </div>
          {!loading && !error && <DeleteFolderButton />}
        </div>
        <ResizableDivider />
        <div className="content">
          {isSearching ? (
            <SearchResults
              prompts={searchResults}
              query={searchQuery}
              total={searchTotal}
              onSelect={handleSearchResultSelect}
            />
          ) : (
            <>
              <div className="content-header">
                <h2>Prompts</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <ViewToggle />
                  {selectedFolderId !== null && (
                    <button
                      className="btn-primary"
                      onClick={() => openEditModal()}
                    >
                      + New Prompt
                    </button>
                  )}
                </div>
              </div>
              {selectedFolderId === null ? (
                <p>Select a folder to view prompts</p>
              ) : viewMode === 'grid' ? (
                <PromptGrid
                  prompts={prompts}
                  onCopy={handleCopy}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onEnhance={handleEnhance}
                  onToggleEasyAccess={handleToggleEasyAccess}
                />
              ) : (
                <PromptList
                  prompts={prompts}
                  folderId={selectedFolderId}
                  onCopy={handleCopy}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onEnhance={handleEnhance}
                  onToggleEasyAccess={handleToggleEasyAccess}
                  onReorderComplete={() => {
                    if (selectedFolderId !== null) {
                      loadPrompts({ folder_id: selectedFolderId });
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>
      <EditModal />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <ShortcutsHelp
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
      <VariableFillDialog
        isOpen={variableFillDialog.isOpen}
        content={variableFillDialog.content}
        promptTitle={variableFillDialog.promptTitle}
        onFill={handleVariableFill}
        onCancel={() => setVariableFillDialog({ isOpen: false, content: '', promptTitle: '' })}
      />
      <EnhanceCompareModal
        isOpen={enhanceModal.isOpen}
        original={enhanceModal.original}
        enhanced={enhanceModal.enhanced}
        isLoading={enhanceModal.isLoading}
        customInstruction={enhanceModal.customInstruction}
        onSelectOriginal={handleSelectOriginal}
        onSelectEnhanced={handleSelectEnhanced}
        onCancel={handleEnhanceModalClose}
        onCustomInstructionChange={(instruction) =>
          setEnhanceModal(prev => ({ ...prev, customInstruction: instruction }))
        }
        onRegenerate={handleRegenerateEnhancement}
      />
    </div>
  )
}

export default App
