import { api } from './api';
import type {
  Prompt,
  PromptCreate,
  PromptUpdate,
  PromptMove,
  PromptListResponse,
  PromptListParams,
  ApiResponse,
} from '@/types/api';

/**
 * Prompt API Service
 * Handles all prompt-related API operations
 */
export const promptApi = {
  /**
   * List prompts with optional filtering and pagination
   * @param params - Query parameters (folder_id, limit, offset, search)
   * @returns Paginated list of prompts
   */
  async list(params?: PromptListParams): Promise<ApiResponse<PromptListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.folder_id !== undefined) {
      queryParams.append('folder_id', params.folder_id.toString());
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/api/prompts?${queryString}` : '/api/prompts';

    return api.get<PromptListResponse>(url);
  },

  /**
   * Get a single prompt by ID (includes version history)
   * @param id - Prompt ID
   * @returns Prompt details with versions
   */
  async getById(id: number): Promise<ApiResponse<Prompt>> {
    return api.get<Prompt>(`/api/prompts/${id}`);
  },

  /**
   * Create a new prompt
   * @param data - Prompt creation data
   * @returns Created prompt
   */
  async create(data: PromptCreate): Promise<ApiResponse<Prompt>> {
    return api.post<Prompt>('/api/prompts', data);
  },

  /**
   * Update an existing prompt (creates new version)
   * @param id - Prompt ID
   * @param data - Update data
   * @returns Updated prompt
   */
  async update(id: number, data: PromptUpdate): Promise<ApiResponse<Prompt>> {
    return api.put<Prompt>(`/api/prompts/${id}`, data);
  },

  /**
   * Delete a prompt
   * @param id - Prompt ID
   * @returns Success message
   */
  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(`/api/prompts/${id}`);
  },

  /**
   * Move a prompt to a different folder
   * @param id - Prompt ID
   * @param data - New folder ID
   * @returns Updated prompt
   */
  async move(id: number, data: PromptMove): Promise<ApiResponse<Prompt>> {
    return api.post<Prompt>(`/api/prompts/${id}/move`, data);
  },

  /**
   * Duplicate a prompt (creates copy with "(Copy)" suffix)
   * @param id - Prompt ID to duplicate
   * @returns New prompt (copy)
   */
  async duplicate(id: number): Promise<ApiResponse<Prompt>> {
    return api.post<Prompt>(`/api/prompts/${id}/duplicate`, {});
  },

  /**
   * Enhance a prompt using Claude CLI
   * @param id - Prompt ID to enhance
   * @param customInstruction - Optional custom enhancement instruction
   * @returns Original and enhanced prompt text
   */
  async enhance(id: number, customInstruction?: string): Promise<ApiResponse<{ original: string; enhanced: string }>> {
    return api.post<{ original: string; enhanced: string }>(
      `/api/prompts/${id}/enhance`,
      { custom_instruction: customInstruction }
    );
  },

  /**
   * Apply an enhanced version to a prompt (creates new version)
   * @param id - Prompt ID
   * @param enhancedContent - The enhanced prompt content
   * @returns Updated prompt
   */
  async applyEnhancement(id: number, enhancedContent: string): Promise<ApiResponse<Prompt>> {
    return api.post<Prompt>(
      `/api/prompts/${id}/apply-enhancement`,
      { enhanced_content: enhancedContent }
    );
  },

  /**
   * Search prompts by query string
   * @param query - Search query
   * @param params - Optional filters (folder_id, tags, limit, offset)
   * @returns Matching prompts
   */
  async search(query: string, params?: Omit<PromptListParams, 'search'>): Promise<ApiResponse<PromptListResponse>> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);

    if (params?.folder_id !== undefined) {
      queryParams.append('folder_id', params.folder_id.toString());
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    return api.get<PromptListResponse>(`/api/prompts/search?${queryParams.toString()}`);
  },
};

export default promptApi;
