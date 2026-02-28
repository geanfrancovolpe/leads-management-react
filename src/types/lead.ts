export interface LeadCampaignAttention {
  id: number;
  lead: number;
  campaign: number;
  campaign_name?: string;
  lead_company_name?: string;
  lead_contact_name?: string;
  last_email_draft?: string | null;
  next_steps?: { A?: string; B?: string } | null;
  needs_attention_state?: NeedsAttentionState | null;
  awaiting_user_instructions_message_id?: string | null;
  unlock_event_id?: string | null;
  unlock_action?: UnlockAction | null;
  last_instructions?: string | null;
  last_instructions_at?: string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}

export interface Lead {
  id?: number;
  
  // Identity & Associations
  user?: number | null;
  campaign?: number | null;
  campaign_name?: string;
  sender_account_id?: number | null;
  
  // Company Information
  company_name?: string | null;
  company_website?: string | null;
  company_description?: string | null;
  company_country?: string | null;
  company_region?: string | null;
  company_city?: string | null;
  company_est_revenue_musd?: number | null;
  company_founded?: number | null;
  company_linkedin_url?: string | null;
  company_ownership_type?: string | null;
  company_addresses?: string | null;
  
  // Contact Information
  contact_full_name?: string | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  contact_middle_name?: string | null;
  contact_title?: string | null;
  contact_email?: string | null;
  contact_linkedin?: string | null;
  contact_location?: string | null;
  
  // Status & Sequence
  status?: LeadStatus;
  conversation_stage?: ConversationStage | null;
  sequence_phase?: SequencePhase;
  sequence_step?: number;
  response_class?: ResponseClass | null;
  
  // Flags
  first_contact?: boolean;
  responded?: boolean;
  
  // Context
  context?: string | null;
  
  // Campaign Attentions (per-campaign attention tracking)
  campaign_attentions?: LeadCampaignAttention[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type LeadStatus = 
  | 'active'
  | 'responded'
  | 'meeting_scheduled'
  | 'closed_no_response'
  | 'closed_negative'
  | 'closed_new_poc'
  | 'needs_attention'
  | 'paused'
  | 'invalid_email';

export type ConversationStage = 
  | 'slots_proposed'
  | 'alt_slots_offered'
  | 'link_followups'
  | 'booked'
  | 'scheduled_recontact'
  | 'new_poc_provided'
  | 'awaiting_user_instructions';

export type SequencePhase = 'cold' | 'warm';

export type ResponseClass = 
  | 'none'
  | 'positive'
  | 'inquiry'
  | 'objection'
  | 'negative_soft'
  | 'negative_definitive'
  | 'slot_accept'
  | 'slot_reschedule'
  | 'cal_confirm'
  | 'ooo'
  | 'bounce'
  | 'scheduled_recontact'
  | 'new_poc_provided';

export type NeedsAttentionState = 'locked' | 'unlocked' | 'resolved';

export type UnlockAction = 'send_draft' | 'apply_instructions' | 'close_contact';

export const LEAD_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'responded', label: 'Responded' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled' },
  { value: 'closed_no_response', label: 'Closed - No Response' },
  { value: 'closed_negative', label: 'Closed - Negative' },
  { value: 'closed_new_poc', label: 'Closed - New POC' },
  { value: 'needs_attention', label: 'Needs Attention' },
  { value: 'paused', label: 'Paused' },
  { value: 'invalid_email', label: 'Invalid Email' }
] as const;

export const CONVERSATION_STAGE_OPTIONS = [
  { value: 'slots_proposed', label: 'Slots Proposed' },
  { value: 'alt_slots_offered', label: 'Alt Slots Offered' },
  { value: 'link_followups', label: 'Link Followups' },
  { value: 'booked', label: 'Booked' },
  { value: 'scheduled_recontact', label: 'Scheduled Recontact' },
  { value: 'new_poc_provided', label: 'New POC Provided' },
  { value: 'awaiting_user_instructions', label: 'Awaiting User Instructions' }
] as const;

export const SEQUENCE_PHASE_OPTIONS = [
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' }
] as const;

export const RESPONSE_CLASS_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'positive', label: 'Positive' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'objection', label: 'Objection' },
  { value: 'negative_soft', label: 'Negative - Soft' },
  { value: 'negative_definitive', label: 'Negative - Definitive' },
  { value: 'slot_accept', label: 'Slot Accept' },
  { value: 'slot_reschedule', label: 'Slot Reschedule' },
  { value: 'cal_confirm', label: 'Calendar Confirm' },
  { value: 'ooo', label: 'Out of Office' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'scheduled_recontact', label: 'Scheduled Recontact' },
  { value: 'new_poc_provided', label: 'New POC Provided' }
] as const;
