import { create } from 'zustand';
import { promptApi } from '@/services';
import type { Prompt, PromptCreate, PromptUpdate, PromptListParams } from '@/types/api';

interface PromptState {
  // State
  prompts: Prompt[];
  selectedPrompt: Prompt | null;
  easyAccessPrompts: Prompt[];
  total: number;
  limit: number;
  offset: number;
  loading: boolean;
  error: string | null;

  // Actions
  loadPrompts: (params?: PromptListParams) => Promise<void>;
  loadPromptById: (id: number) => Promise<void>;
  createPrompt: (data: PromptCreate) => Promise<Prompt | null>;
  updatePrompt: (id: number, data: PromptUpdate) => Promise<Prompt | null>;
  deletePrompt: (id: number) => Promise<boolean>;
  movePrompt: (id: number, folderId: number) => Promise<Prompt | null>;
  duplicatePrompt: (id: number) => Promise<Prompt | null>;
  toggleEasyAccess: (id: number, enable: boolean) => Promise<Prompt | null>;
  loadEasyAccessPrompts: () => Promise<void>;

  // Helpers
  setSelectedPrompt: (prompt: Prompt | null) => void;
  clearError: () => void;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  // Initial state
  prompts: [],
  selectedPrompt: null,
  easyAccessPrompts: [],
  total: 0,
  limit: 50,
  offset: 0,
  loading: false,
  error: null,

  // Load prompts with optional filtering
  loadPrompts: async (params?: PromptListParams) => {
    set({ loading: true, error: null });

    const result = await promptApi.list({
      limit: get().limit,
      offset: get().offset,
      ...params,
    });

    if (result.error) {
      set({ loading: false, error: result.error.message });
    } else {
      const data = result.data;
      set({
        prompts: data?.prompts || [],
        total: data?.total || 0,
        limit: data?.limit || 50,
        offset: data?.offset || 0,
        loading: false,
        error: null,
      });
    }
  },

  // Load single prompt by ID (with version history)
  loadPromptById: async (id: number) => {
    set({ loading: true, error: null });

    const result = await promptApi.getById(id);

    if (result.error) {
      set({ loading: false, error: result.error.message });
    } else {
      set({
        selectedPrompt: result.data || null,
        loading: false,
        error: null,
      });
    }
  },

  // Create new prompt
  createPrompt: async (data: PromptCreate) => {
    set({ loading: true, error: null });

    const result = await promptApi.create(data);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    // Reload prompts for the folder
    await get().loadPrompts({ folder_id: data.folder_id });
    return result.data || null;
  },

  // Update prompt
  updatePrompt: async (id: number, data: PromptUpdate) => {
    set({ loading: true, error: null });

    const result = await promptApi.update(id, data);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    // Update the prompt in the list
    const updatedPrompt = result.data;
    if (updatedPrompt) {
      set(state => ({
        prompts: state.prompts.map(p =>
          p.id === updatedPrompt.id ? updatedPrompt : p
        ),
        selectedPrompt: state.selectedPrompt?.id === updatedPrompt.id
          ? updatedPrompt
          : state.selectedPrompt,
        loading: false,
      }));
    } else {
      set({ loading: false });
    }

    return result.data || null;
  },

  // Delete prompt
  deletePrompt: async (id: number) => {
    set({ loading: true, error: null });

    const result = await promptApi.delete(id);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return false;
    }

    // Remove from list
    set(state => ({
      prompts: state.prompts.filter(p => p.id !== id),
      selectedPrompt: state.selectedPrompt?.id === id ? null : state.selectedPrompt,
      loading: false,
    }));

    return true;
  },

  // Move prompt to different folder
  movePrompt: async (id: number, folderId: number) => {
    set({ loading: true, error: null });

    const result = await promptApi.move(id, { folder_id: folderId });

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    // Remove from current list (will be in new folder now)
    set(state => ({
      prompts: state.prompts.filter(p => p.id !== id),
      loading: false,
    }));

    return result.data || null;
  },

  // Duplicate prompt
  duplicatePrompt: async (id: number) => {
    set({ loading: true, error: null });

    const result = await promptApi.duplicate(id);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    // Add to list
    const newPrompt = result.data;
    if (newPrompt) {
      set(state => ({
        prompts: [newPrompt, ...state.prompts],
        loading: false,
      }));
    } else {
      set({ loading: false });
    }

    return result.data || null;
  },

  // Toggle easy access status
  toggleEasyAccess: async (id: number, enable: boolean) => {
    set({ loading: true, error: null });

    const result = await promptApi.toggleEasyAccess(id, enable);

    if (result.error) {
      set({ loading: false, error: result.error.message });
      return null;
    }

    const updatedPrompt = result.data;
    if (updatedPrompt) {
      // Update the prompt in the list
      set(state => ({
        prompts: state.prompts.map(p =>
          p.id === updatedPrompt.id ? updatedPrompt : p
        ),
        loading: false,
      }));

      // Reload easy access prompts
      get().loadEasyAccessPrompts();
    } else {
      set({ loading: false });
    }

    return result.data || null;
  },

  // Load easy access prompts
  loadEasyAccessPrompts: async () => {
    const result = await promptApi.getEasyAccessPrompts();

    if (result.error) {
      console.error('Failed to load easy access prompts:', result.error);
      return;
    }

    set({
      easyAccessPrompts: result.data?.prompts || [],
    });
  },

  // Set selected prompt
  setSelectedPrompt: (prompt: Prompt | null) => {
    set({ selectedPrompt: prompt });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
