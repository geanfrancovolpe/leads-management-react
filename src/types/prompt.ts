export interface PromptLibrary {
  id?: number;
  campaign?: number | null;
  campaign_name?: string;
  template_name?: string;
  sequence_phase: 'prospecting' | 'initial_contact' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost' | 'cold' | 'warm' | 'hot' | 'nurture';
  sequence_step: number;
  delay_hours: number;
  purpose: 'connection_request' | 'follow_up' | 'introduction' | 'value_proposition' | 'meeting_request' | 'closing' | 'first_contact' | 'value_prop' | 'objection_handling' | 'nurture' | 'other';
  system_message: string;
  user_message: string;
  language?: string;
  content_idea?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedPromptLibraryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PromptLibrary[];
}
