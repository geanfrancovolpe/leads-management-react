import apiClient from '../api-client';
import { OnboardingStep } from '@/types';

export const onboardingService = {
  /**
   * Get onboarding steps
   */
  async getSteps(): Promise<{ steps: OnboardingStep[] }> {
    const response = await apiClient.get<{ steps: OnboardingStep[] }>('/onboarding/steps/');
    return response.data;
  },

  /**
   * Complete onboarding
   */
  async completeOnboarding(responses: { step_id: number; value: string }[]): Promise<{
    success: boolean;
    message: string;
    redirect_to: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      redirect_to: string;
    }>('/onboarding/complete/', { responses });
    return response.data;
  },
};
