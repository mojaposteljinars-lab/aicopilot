"use client";

import { useEffect, useRef } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

interface SubtitleViewProps {
  message: string;
  themeClass: string;
}

export function SubtitleView({ message, themeClass }: SubtitleViewProps) {
  const displayText = useTypewriter(message, 25);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayText]);

  return (
    <div ref={scrollRef} className="h-full w-full overflow-y-auto">
      <p className={cn("whitespace-pre-wrap break-words font-medium leading-relaxed", themeClass)}>
        {displayText}
      </p>
    </div>
  );
}
