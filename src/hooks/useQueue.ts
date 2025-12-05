"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type MessageCallback = (message: string) => void;

export function useQueue() {
  const [queue, setQueue] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const onMessageCallback = useRef<MessageCallback | null>(null);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) {
      return;
    }

    setIsProcessing(true);
    const messageToProcess = queue[0];
    
    try {
        if (onMessageCallback.current) {
            await onMessageCallback.current(messageToProcess);
        }
    } catch(e) {
        console.error("Error processing queue message:", e);
    } finally {
        setQueue(prev => prev.slice(1));
        setIsProcessing(false);
    }

  }, [queue, isProcessing]);

  useEffect(() => {
    if (!isProcessing && queue.length > 0) {
      const timer = setTimeout(processQueue, 500); // Debounce processing
      return () => clearTimeout(timer);
    }
  }, [queue, isProcessing, processQueue]);

  const addToQueue = (message: string) => {
    setQueue(prev => [...prev, message]);
  };

  const onMessage = (callback: MessageCallback | null) => {
    onMessageCallback.current = callback;
  };

  const clearQueue = () => {
    setQueue([]);
    setIsProcessing(false);
  };
  
  const on = (event: string, callback: (...args: any[]) => void) => {
    // Placeholder for a more robust event emitter if needed
  };
  
  const off = (event: string, callback: (...args: any[]) => void) => {
    // Placeholder for a more robust event emitter if needed
  };


  return { addToQueue, onMessage, on, off, isProcessing, clearQueue };
}
