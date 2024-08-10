"use client";

import { Bot } from 'lucide-react';
import { useState } from 'react';
import AnonymousAIChatBox from './AnonymousAiChatBox';
import { Button } from './ui/button';

export default function AnonymousAIChatButton({ className = 'w-80 h-12' }) {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        Chat Anonymously with Life-Coach AI
      </Button>
      <AnonymousAIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
