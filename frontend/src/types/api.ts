// TypeScript types matching backend API models

// Folder types
export interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  path: string;
  created_at: string;
  updated_at: string;
  children?: Folder[];
}

export interface FolderCreate {
  name: string;
  parent_id: number | null;
}

export interface FolderUpdate {
  name: string;
}

export interface FolderMove {
  new_parent_id: number | null;
}

// Prompt types
export interface Prompt {
  id: number;
  folder_id: number;
  title: string;
  description?: string | null;
  content: string;
  original_content: string | null;
  is_ai_enhanced: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  version?: number;
  versions?: Version[];
}

export interface PromptCreate {
  folder_id: number;
  title: string;
  description?: string;
  content: string;
  tags?: string[];
}

export interface PromptUpdate {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
}

export interface PromptMove {
  folder_id: number;
}

export interface PromptReorder {
  prompt_id: number;
  new_position: number;
  folder_id: number;
}

export interface PromptListResponse {
  prompts: Prompt[];
  total: number;
  limit: number;
  offset: number;
}

// Version types
export interface Version {
  id: number;
  prompt_id: number;
  content: string;
  created_by: string;
  created_at: string;
}

// API response wrappers
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Query parameters
export interface PromptListParams {
  folder_id?: number;
  limit?: number;
  offset?: number;
  search?: string;
}
