import { api } from './api';
import type {
  Folder,
  FolderCreate,
  FolderUpdate,
  FolderMove,
  ApiResponse,
} from '@/types/api';

/**
 * Folder API Service
 * Handles all folder-related API operations
 */
export const folderApi = {
  /**
   * Get complete folder tree
   * @returns Hierarchical folder structure
   */
  async getTree(): Promise<ApiResponse<Folder[]>> {
    return api.get<Folder[]>('/api/folders');
  },

  /**
   * Get a single folder by ID
   * @param id - Folder ID
   * @returns Folder details
   */
  async getById(id: number): Promise<ApiResponse<Folder>> {
    return api.get<Folder>(`/api/folders/${id}`);
  },

  /**
   * Create a new folder
   * @param data - Folder creation data
   * @returns Created folder
   */
  async create(data: FolderCreate): Promise<ApiResponse<Folder>> {
    return api.post<Folder>('/api/folders', data);
  },

  /**
   * Update an existing folder
   * @param id - Folder ID
   * @param data - Update data (name only)
   * @returns Updated folder
   */
  async update(id: number, data: FolderUpdate): Promise<ApiResponse<Folder>> {
    return api.put<Folder>(`/api/folders/${id}`, data);
  },

  /**
   * Delete a folder (cascades to children and prompts)
   * @param id - Folder ID
   * @returns Success message
   */
  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(`/api/folders/${id}`);
  },

  /**
   * Move a folder to a different parent
   * @param id - Folder ID to move
   * @param data - New parent ID
   * @returns Updated folder with new path
   */
  async move(id: number, data: FolderMove): Promise<ApiResponse<Folder>> {
    return api.post<Folder>(`/api/folders/${id}/move`, data);
  },
};

export default folderApi;
