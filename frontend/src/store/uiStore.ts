import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';

interface UIState {
  // Selected folder
  selectedFolderId: number | null;
  setSelectedFolderId: (id: number | null) => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Modals
  isEditModalOpen: boolean;
  editModalPromptId: number | null;
  openEditModal: (promptId?: number) => void;
  closeEditModal: () => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast notifications
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  };
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Selected folder
      selectedFolderId: null,
      setSelectedFolderId: (id) => set({ selectedFolderId: id }),

      // View mode
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleViewMode: () => set((state) => ({
        viewMode: state.viewMode === 'grid' ? 'list' : 'grid',
      })),

      // Modals
      isEditModalOpen: false,
      editModalPromptId: null,
      openEditModal: (promptId) => set({
        isEditModalOpen: true,
        editModalPromptId: promptId || null,
      }),
      closeEditModal: () => set({
        isEditModalOpen: false,
        editModalPromptId: null,
      }),

      // Sidebar
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({
        isSidebarCollapsed: !state.isSidebarCollapsed,
      })),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Toast
      toast: {
        message: '',
        type: 'info',
        visible: false,
      },
      showToast: (message, type = 'info') => set({
        toast: { message, type, visible: true },
      }),
      hideToast: () => set((state) => ({
        toast: { ...state.toast, visible: false },
      })),
    }),
    {
      name: 'prompt-manager-ui', // Persist UI preferences
      partialize: (state) => ({
        // Only persist these values
        isSidebarCollapsed: state.isSidebarCollapsed,
        selectedFolderId: state.selectedFolderId,
        viewMode: state.viewMode,
      }),
    }
  )
);
