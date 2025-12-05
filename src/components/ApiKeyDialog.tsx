"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { KeyRound } from "lucide-react";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export function ApiKeyDialog({ isOpen, onOpenChange, apiKey, setApiKey }: ApiKeyDialogProps) {
  const [localKey, setLocalKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(localKey);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-accent" />
            Configure Gemini API Key
          </DialogTitle>
          <DialogDescription>
            Please enter your Google AI Gemini API key to use InterviewAce. Your key is stored only in your browser's local storage.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!localKey}>Save Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
