import apiClient from '../api-client';
import { Credential } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.workairs.co';

export const credentialsService = {
  /**
   * List all credentials
   */
  async getCredentials(): Promise<Credential[]> {
    const response = await apiClient.get<Credential[]>('/credentials/list/');
    return response.data;
  },

  /**
   * Delete a credential
   */
  async deleteCredential(id: number): Promise<void> {
    await apiClient.delete(`/credentials/${id}/`);
  },

  /**
   * Initiate OAuth flow
   */
  initiateOAuth(provider: string, state?: string): void {
    let url = `${API_BASE_URL}/oauth/login/`;
    const params: string[] = [];
    params.push(`provider=${encodeURIComponent(provider)}`);
    if (state) {
      params.push(`state=${encodeURIComponent(state)}`);
    }
    if (params.length > 0) {
      url = `${url}?${params.join('&')}`;
    }
    window.location.href = url;
  },

  /**
   * Handle OAuth callback
   */
  async oauthCallback(hash: string): Promise<any> {
    const raw = (hash && hash.startsWith('#')) ? hash.substring(1) : (hash || '');
    const paramsFromHash = new URLSearchParams(raw);
    const code = paramsFromHash.get('code');

    const params: any = {};
    if (code) {
      params.code = code;
    } else if (raw) {
      params.hash = raw;
    }

    const response = await apiClient.get('/oauth/callback/', { params });
    return response.data;
  },
};
