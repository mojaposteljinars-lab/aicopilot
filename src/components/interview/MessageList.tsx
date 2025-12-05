"use client";

import type { InterviewMessage } from "@/lib/types";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: InterviewMessage[];
  themeClass: string;
}

export function MessageList({ messages, themeClass }: MessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-3">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            message.role === 'model' ? 'bg-primary/20 text-primary' : 'bg-muted'
          )}>
            {message.role === 'model' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-sm">
              {message.role === 'model' ? 'InterviewAce' : 'Interviewer'}
            </p>
            <p className={cn("leading-relaxed", message.role === 'model' ? themeClass : 'text-muted-foreground')}>
              {message.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
