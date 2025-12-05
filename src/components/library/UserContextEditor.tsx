"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserContext } from "@/lib/types";
import { Save, User } from "lucide-react";

interface UserContextEditorProps {
  userContext: UserContext;
  setUserContext: (context: UserContext) => void;
}

export function UserContextEditor({ userContext, setUserContext }: UserContextEditorProps) {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const updatedContext: UserContext = {
      resume: formData.get('resume') as string,
      speakingStyle: formData.get('speakingStyle') as string,
    };
    setUserContext(updatedContext);
    toast({
      title: "User Profile Saved",
      description: "Your resume and speaking style have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          My Profile
        </CardTitle>
        <CardDescription>
          This information helps the AI tailor answers to your experience and personality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">CV / Resume</Label>
            <Textarea
              id="resume"
              name="resume"
              placeholder="Paste your resume here..."
              defaultValue={userContext.resume}
              className="h-48 font-code text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speakingStyle">Speaking Style</Label>
            <Textarea
              id="speakingStyle"
              name="speakingStyle"
              placeholder="e.g., Confident and direct, using the STAR method."
              defaultValue={userContext.speakingStyle}
              className="h-24"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
