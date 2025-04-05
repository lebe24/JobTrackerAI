import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  userId: number;
  message: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

const AiChat = () => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { data: chatMessages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/chat'],
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat", { message });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat'] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) return;
    
    await sendMessageMutation.mutateAsync(message);
    setMessage("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-5 py-4 border-b border-slate-200 flex-shrink-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-slate-900">AI Assistant</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem>Assistant Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-slate-500">Loading messages...</p>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-slate-500">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div 
              key={msg.id}
              className={`ai-chat-bubble ${
                msg.role === "assistant" 
                  ? "assistant bg-slate-200 self-start rounded-tr-2xl rounded-bl-2xl rounded-br-2xl ml-2" 
                  : "user bg-blue-100 self-end rounded-tl-2xl rounded-bl-2xl rounded-br-2xl mr-2 ml-auto"
              }`}
            >
              <p className="text-sm text-slate-800 whitespace-pre-line">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <form 
        onSubmit={handleSendMessage} 
        className="px-4 py-3 bg-slate-50 border-t border-slate-200 mt-auto"
      >
        <div className="flex items-center">
          <Input
            className="flex-1 focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md sm:text-sm border-slate-300"
            placeholder="Ask the AI assistant..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            type="submit" 
            size="icon"
            className="ml-3 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={sendMessageMutation.isPending || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AiChat;
