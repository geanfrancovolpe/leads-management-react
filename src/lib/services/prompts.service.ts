import apiClient from '../api-client';
import { PromptLibrary, PaginatedPromptLibraryResponse } from '@/types/prompt';

export const promptsService = {
  /**
   * Get all prompts with optional filtering
   */
  async getPrompts(search?: string, ordering?: string): Promise<PaginatedPromptLibraryResponse> {
    const params: any = {};
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;
    
    const response = await apiClient.get<PaginatedPromptLibraryResponse>('/leads/prompts/', { params });
    return response.data;
  },

  /**
   * Get a specific prompt
   */
  async getPrompt(id: string | number): Promise<PromptLibrary> {
    const response = await apiClient.get<PromptLibrary>(`/leads/prompts/${id}/`);
    return response.data;
  },

  /**
   * Create a new prompt
   */
  async createPrompt(data: Partial<PromptLibrary>): Promise<PromptLibrary> {
    const response = await apiClient.post<PromptLibrary>('/leads/prompts/', data);
    return response.data;
  },

  /**
   * Update a prompt (full update)
   */
  async updatePrompt(id: string | number, data: Partial<PromptLibrary>): Promise<PromptLibrary> {
    const response = await apiClient.put<PromptLibrary>(`/leads/prompts/${id}/`, data);
    return response.data;
  },

  /**
   * Partially update a prompt
   */
  async patchPrompt(id: string | number, data: Partial<PromptLibrary>): Promise<PromptLibrary> {
    const response = await apiClient.patch<PromptLibrary>(`/leads/prompts/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a prompt
   */
  async deletePrompt(id: string | number): Promise<void> {
    await apiClient.delete(`/leads/prompts/${id}/`);
  },

  /**
   * Get prompts by campaign
   */
  async getPromptsByCampaign(campaignId: string | number, search?: string, ordering?: string): Promise<PromptLibrary[]> {
    const params: any = { campaign_id: campaignId };
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;
    
    const response = await apiClient.get<PromptLibrary[]>('/leads/prompts/by_campaign/', { params });
    return response.data;
  },
};
