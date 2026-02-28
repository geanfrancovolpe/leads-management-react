export interface Campaign {
  id: number;
  campaign_name: string;
  contact_type: string;
  created_at: string;
  language: string;
  leads_count: number;
  region: string;
  status: string;
  updated_at: string;
  user_account: number;
  user_account_email: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  message_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: {
    model?: string;
    tokens?: number;
    function_name?: string;
    function_result?: any;
  };
}

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  onboarding_completed?: boolean;
}

export interface Credential {
  id: number;
  provider: string;
  email: string;
  status: 'connected' | 'disconnected' | 'error';
  created_at: string;
  updated_at: string;
}

export interface OnboardingStep {
  id: number;
  order: number;
  title: string;
  description: string;
  type: 'text' | 'select' | 'multiselect' | 'oauth';
  options?: { value: string; label: string }[];
  required: boolean;
}

export interface ChatStreamEvent {
  type: 'start' | 'token' | 'function_call' | 'function_result' | 'done' | 'error';
  content?: string;
  metadata?: {
    conversation_id?: string;
    model?: string;
    response_time_ms?: number;
    tokens_used?: number;
    function_name?: string;
    arguments?: any;
    success?: boolean;
    result?: any;
    iteration?: number;
  };
}

export interface ConversationFile {
  id: string;
  conversation?: string;
  file_url: string;
  original_filename: string;
  file_type: 'csv' | 'xlsx' | 'xls' | 'json' | 'txt' | 'pdf' | 'other';
  file_size: number;
  mime_type: string;
  purpose: 'leads_bulk_upload' | 'campaigns_data' | 'analysis' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processing_result?: {
    created: number;
    skipped: number;
    errors: Array<{ row: number; error: string }>;
  };
  error_message?: string;
  processed_by_tool?: string;
  processed_at?: string;
  processing_summary?: {
    status: string;
    filename: string;
    created?: number;
    skipped?: number;
    errors_count?: number;
    error?: string;
  };
  created_at: string;
  updated_at: string;
}
