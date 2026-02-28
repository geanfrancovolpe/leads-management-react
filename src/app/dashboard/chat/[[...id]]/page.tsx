'use client';

import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { chatService } from '@/lib/services/chat.service';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  functionCalls?: Array<{
    name: string;
    success?: boolean;
    result?: any;
  }>;
}

export default function ChatPage() {
  const params = useParams();
  const conversationId = params?.id as string | undefined;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentConversationId) {
      loadHistory();
    }
  }, [currentConversationId]);

  const loadHistory = async () => {
    if (!currentConversationId) return;
    
    try {
      const history = await chatService.getConversationHistory(currentConversationId);
      setMessages(history.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })));
    } catch (error) {
      toast.error('Failed to load conversation history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    // Add placeholder for assistant message
    setMessages((prev) => [...prev, { role: 'assistant', content: '', isStreaming: true, functionCalls: [] }]);

    try {
      const { stream } = chatService.streamChat({
        message: userMessage,
        conversation_id: currentConversationId,
      });

      const reader = stream.getReader();
      let assistantContent = '';
      let functionCalls: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        switch (value.type) {
          case 'start':
            if (value.metadata?.conversation_id && !currentConversationId) {
              setCurrentConversationId(value.metadata.conversation_id);
              window.history.pushState({}, '', `/dashboard/chat/${value.metadata.conversation_id}`);
            }
            break;

          case 'token':
            if (value.content) {
              assistantContent += value.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                  isStreaming: true,
                  functionCalls,
                };
                return updated;
              });
            }
            break;

          case 'function_call':
            functionCalls.push({
              name: value.metadata?.function_name || 'unknown',
              success: undefined,
            });
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                functionCalls: [...functionCalls],
              };
              return updated;
            });
            break;

          case 'function_result':
            const lastCall = functionCalls[functionCalls.length - 1];
            if (lastCall) {
              lastCall.success = value.metadata?.success;
              lastCall.result = value.metadata?.result;
            }
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                functionCalls: [...functionCalls],
              };
              return updated;
            });
            break;

          case 'done':
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                isStreaming: false,
              };
              return updated;
            });
            break;

          case 'error':
            toast.error(value.content || 'An error occurred');
            break;
        }
      }
    } catch (error: any) {
      toast.error('Failed to send message');
      // Remove the placeholder message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">AI Chat</h1>
          <p className="text-gray-600 mt-2">Chat with your AI assistant</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12">
                <p>Start a conversation with your AI assistant</p>
              </div>
            ) : (
              messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.isStreaming && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
                    
                    {message.functionCalls && message.functionCalls.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.functionCalls.map((call, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            {call.success === undefined ? (
                              <Wrench className="w-3 h-3" />
                            ) : call.success ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-600" />
                            )}
                            <span className="text-xs">{call.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="resize-none"
                rows={2}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
