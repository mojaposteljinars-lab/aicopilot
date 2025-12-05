import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            InterviewAce
          </h1>
        </div>
      </div>
    </header>
  );
}
