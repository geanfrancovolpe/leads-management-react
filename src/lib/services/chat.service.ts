import apiClient from '../api-client';
import { Conversation, Message, ChatStreamEvent } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.workairs.co';

export const chatService = {
  /**
   * Stream chat with SSE
   */
  streamChat(payload: {
    message: string;
    conversation_id?: string;
    files?: File[];
  }): {
    stream: ReadableStream<ChatStreamEvent>;
    cancel: () => void;
  } {
    let abortController: AbortController | null = null;

    const stream = new ReadableStream<ChatStreamEvent>({
      async start(controller) {
        abortController = new AbortController();
        
        const url = `${API_BASE_URL}/agent/chat/stream/`;
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('token') || sessionStorage.getItem('token')
          : null;
        
        const hasFiles = payload.files && payload.files.length > 0;
        let body: FormData | string;
        const headers: Record<string, string> = {};
        
        if (hasFiles) {
          const formData = new FormData();
          formData.append('message', payload.message);
          if (payload.conversation_id) {
            formData.append('conversation_id', payload.conversation_id);
          }
          payload.files!.forEach(file => {
            formData.append('files', file);
          });
          body = formData;
        } else {
          body = JSON.stringify({
            message: payload.message,
            conversation_id: payload.conversation_id,
            stream: true,
          });
          headers['Content-Type'] = 'application/json';
        }
        
        if (token) {
          headers['Authorization'] = `Token ${token}`;
        }
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
            credentials: 'include',
            signal: abortController.signal,
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          
          if (!reader) {
            throw new Error('No readable stream available');
          }
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.substring(6).trim();
                  if (!jsonStr) continue;
                  
                  const data = JSON.parse(jsonStr) as ChatStreamEvent;
                  controller.enqueue(data);
                  
                  if (data.type === 'done' || data.type === 'error') {
                    controller.close();
                    return;
                  }
                } catch (e) {
                  console.error('Error parsing SSE data:', e);
                }
              }
            }
          }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            controller.error(error);
          }
        }
      },
    });

    return {
      stream,
      cancel: () => abortController?.abort(),
    };
  },

  /**
   * Send chat without streaming (fallback)
   */
  async chatNoStream(payload: {
    message: string;
    conversation_id?: string;
  }): Promise<{
    conversation_id: string;
    message: string;
    model: string;
    response_time_ms: number;
    tokens_used?: number;
  }> {
    const response = await apiClient.post('/agent/chat/', {
      message: payload.message,
      conversation_id: payload.conversation_id,
      stream: false,
    });
    return response.data;
  },

  /**
   * Get all conversations
   */
  async getConversations(isArchived?: boolean, limit?: number): Promise<Conversation[]> {
    const params: any = {};
    if (isArchived !== undefined) params.is_archived = isArchived;
    if (limit !== undefined) params.limit = limit;
    
    const response = await apiClient.get<Conversation[]>('/agent/conversations/', { params });
    return response.data;
  },

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get<Message[]>('/agent/history/', {
      params: { conversation_id: conversationId },
    });
    return response.data;
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await apiClient.delete('/agent/history/', {
      params: { conversation_id: conversationId },
    });
  },
};
