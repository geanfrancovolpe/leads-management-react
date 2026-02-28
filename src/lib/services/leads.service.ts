import apiClient from '../api-client';
import { Lead } from '@/types/lead';
import { PaginatedResponse } from '@/types';

export const leadsService = {
  /**
   * Get all leads with optional filtering
   */
  async getLeads(search?: string, ordering?: string): Promise<PaginatedResponse<Lead>> {
    const params: any = {};
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;
    
    const response = await apiClient.get<PaginatedResponse<Lead>>('/leads/leads/', { params });
    return response.data;
  },

  /**
   * Get a specific lead
   */
  async getLead(id: string | number): Promise<Lead> {
    const response = await apiClient.get<Lead>(`/leads/leads/${id}/`);
    return response.data;
  },

  /**
   * Create a new lead
   */
  async createLead(data: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.post<Lead>('/leads/leads/', data);
    return response.data;
  },

  /**
   * Update a lead (full update)
   */
  async updateLead(id: string | number, data: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.put<Lead>(`/leads/leads/${id}/`, data);
    return response.data;
  },

  /**
   * Partially update a lead
   */
  async patchLead(id: string | number, data: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.patch<Lead>(`/leads/leads/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a lead
   */
  async deleteLead(id: string | number): Promise<void> {
    await apiClient.delete(`/leads/leads/${id}/`);
  },

  /**
   * Upload leads file (CSV/XLSX)
   */
  async uploadLeadsFile(file: File): Promise<{ created: number; skipped: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ created: number; skipped: number; errors: any[] }>(
      '/leads/upload/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  /**
   * Mark lead as responded
   */
  async markLeadResponded(id: string | number): Promise<Lead> {
    const response = await apiClient.post<Lead>(`/leads/leads/${id}/mark_responded/`, {});
    return response.data;
  },

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string | number, status: string): Promise<Lead> {
    const response = await apiClient.post<Lead>(`/leads/leads/${id}/update_status/`, { status });
    return response.data;
  },

  /**
   * Unlock lead action for needs_attention workflow
   */
  async unlockLeadAction(
    id: number,
    payload: {
      unlock_action: 'send_draft' | 'apply_instructions' | 'close_contact';
      unlock_event_id: string;
      last_instructions?: string;
      campaign_id?: number;
    }
  ): Promise<Lead> {
    const response = await apiClient.post<Lead>(`/leads/leads/${id}/unlock_action/`, payload);
    return response.data;
  },

  /**
   * Get lead statistics
   */
  async getLeadStats(search?: string, ordering?: string): Promise<any> {
    const params: any = {};
    if (search) params.search = search;
    if (ordering) params.ordering = ordering;
    
    const response = await apiClient.get<any>('/leads/leads/stats/', { params });
    return response.data;
  },
};
