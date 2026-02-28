import apiClient from '../api-client';
import { Campaign, PaginatedResponse } from '@/types';

export const campaignsService = {
  /**
   * Get all campaigns with optional filtering
   */
  async getCampaigns(search?: string, ordering?: string): Promise<PaginatedResponse<Campaign>> {
    const params: any = {};
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;
    
    const response = await apiClient.get<PaginatedResponse<Campaign>>('/leads/campaigns/', { params });
    return response.data;
  },

  /**
   * Get a specific campaign
   */
  async getCampaign(id: string | number): Promise<Campaign> {
    const response = await apiClient.get<Campaign>(`/leads/campaigns/${id}/`);
    return response.data;
  },

  /**
   * Create a new campaign
   */
  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.post<Campaign>('/leads/campaigns/', data);
    return response.data;
  },

  /**
   * Update a campaign (full update)
   */
  async updateCampaign(id: string | number, data: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.put<Campaign>(`/leads/campaigns/${id}/`, data);
    return response.data;
  },

  /**
   * Partially update a campaign
   */
  async patchCampaign(id: string | number, data: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.patch<Campaign>(`/leads/campaigns/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a campaign
   */
  async deleteCampaign(id: string | number): Promise<void> {
    await apiClient.delete(`/leads/campaigns/${id}/`);
  },

  /**
   * Activate a campaign
   */
  async activateCampaign(id: string | number): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(`/leads/campaigns/${id}/activate/`, {});
    return response.data;
  },

  /**
   * Pause a campaign
   */
  async pauseCampaign(id: string | number): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(`/leads/campaigns/${id}/pause/`, {});
    return response.data;
  },
};
