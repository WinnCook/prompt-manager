import { create } from 'zustand';
import { folderApi } from '@/services';
import type { Folder, FolderCreate, FolderUpdate } from '@/types/api';

interface FolderState {
  // State
  folders: Folder[];
  loading: boolean;
  error: string | null;

  // Actions
  loadFolders: () => Promise<void>;
  createFolder: (data: FolderCreate) => Promise<Folder | null>;
  updateFolder: (id: number, data: FolderUpdate) => Promise<Folder | null>;
  deleteFolder: (id: number) => Promise<boolean>;
  moveFolder: (id: number, parentId: number | null) => Promise<Folder | null>;

  // Helper
  getFolderById: (id: number) => Folder | undefined;
  clearError: () => void;
}

export const useFolderStore = create<FolderState>((set, get) => ({
  // Initial state
  folders: [],
  loading: false,
  error: null,

  // Load all folders
  loadFolders: async () => {
    set({ loading: true, error: null });

    const result = await folderApi.getTree();

    if (result.error) {
      set({ loading: false, error: result.error.message });
    } else {
      set({
        folders: result.data?.folders || [],
        loading: false,
        error: null
      });
    }
  },

  // Create new folder
  createFolder: async (data: FolderCreate) => {
    set({ loading: true, error: null });

    const result = await folderApi.create(data);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    // Reload folders to get updated tree
    await get().loadFolders();
    return result.data || null;
  },

  // Update folder
  updateFolder: async (id: number, data: FolderUpdate) => {
    set({ loading: true, error: null });

    const result = await folderApi.update(id, data);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    // Reload folders to get updated tree
    await get().loadFolders();
    return result.data || null;
  },

  // Delete folder
  deleteFolder: async (id: number) => {
    set({ loading: true, error: null });

    const result = await folderApi.delete(id);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return false;
    }

    // Reload folders to get updated tree
    await get().loadFolders();
    return true;
  },

  // Move folder
  moveFolder: async (id: number, parentId: number | null) => {
    set({ loading: true, error: null });

    const result = await folderApi.move(id, { new_parent_id: parentId });

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    // Reload folders to get updated tree
    await get().loadFolders();
    return result.data || null;
  },

  // Helper to find folder by ID in tree
  getFolderById: (id: number) => {
    const findFolder = (folders: Folder[]): Folder | undefined => {
      for (const folder of folders) {
        if (folder.id === id) return folder;
        if (folder.children) {
          const found = findFolder(folder.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findFolder(get().folders);
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
