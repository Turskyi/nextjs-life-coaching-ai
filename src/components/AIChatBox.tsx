import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { Bot, Trash, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const placeholders = [
  'Share your thoughts...',
  "What's on your mind?",
  'How can I assist you today?',
  'What are you thinking about?',
  'Need some guidance?',
  "Let's explore your goals...",
  "What's your next big idea?",
  'How can I help you today?',
  "What's your current challenge?",
  'Tell me your thoughts...',
  "What's on your agenda?",
  'What would you like to discuss?',
  'Ready to unlock your potential?',
];

function getRandomPlaceholder() {
  return placeholders[Math.floor(Math.random() * placeholders.length)];
}

const emptyStateMessages = [
  'What would you like to achieve today?',
  'Share your goals with the Life-Coach AI.',
  "Let's start your journey. Ask me anything!",
  'How can I help you reach your potential?',
  'Tell me about your aspirations.',
  "Ready to set some goals? Let's chat!",
  "What's your next big step?",
  "Need some guidance? I'm here to help.",
  "What's on your mind today?",
  "Let's explore your dreams together.",
];

function getRandomEmptyStateMessage() {
  return emptyStateMessages[
    Math.floor(Math.random() * emptyStateMessages.length)
  ];
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({ api: 'api/chat-web-en' });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [placeholder, setPlaceholder] = useState(getRandomPlaceholder());
  const [emptyStateMessage, setEmptyStateMessage] = useState(
    'Ask the Life-Coach AI a question about your goals.',
  );

  useEffect(() => {
    setEmptyStateMessage(getRandomEmptyStateMessage());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === 'user';

  return (
    <div
      className={cn(
        // Positioning of the chat-box.
        'bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36',
        open ? 'fixed' : 'hidden',
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: '🤔 Thinking...',
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: '😨 Something went wrong. Please try again.',
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              {emptyStateMessage}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title="Clear chat"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={placeholder}
            ref={inputRef}
            onFocus={() => setPlaceholder(getRandomPlaceholder())}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, 'role' | 'content'>;
}) {
  const { user } = useUser();

  const isAiMessage = role === 'assistant';

  return (
    <div
      className={cn(
        'mb-3 flex items-center',
        isAiMessage ? 'me-5 justify-start' : 'ms-5 justify-end',
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          'whitespace-pre-line rounded-md border px-3 py-2',
          isAiMessage ? 'bg-background' : 'bg-primary text-primary-foreground',
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User image"
          width={100}
          height={100}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
