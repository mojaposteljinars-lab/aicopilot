"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContextEditor } from "@/components/library/UserContextEditor";
import { JobApplicationsManager } from "@/components/library/JobApplicationsManager";
import { InterviewController } from "@/components/interview/InterviewController";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { JobContext, UserContext } from '@/lib/types';
import { BookCopy, Mic } from 'lucide-react';

export function Dashboard() {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini-api-key', '');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  const [userContext, setUserContext] = useLocalStorage<UserContext>('user-context', {
    resume: '',
    speakingStyle: 'Clear and concise, professional yet approachable.',
  });

  const [jobApplications, setJobApplications] = useLocalStorage<JobContext[]>('job-applications', []);

  useEffect(() => {
    if (!apiKey) {
      setIsApiKeyDialogOpen(true);
    }
  }, [apiKey]);

  return (
    <>
      <Tabs defaultValue="interview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interview">
            <Mic className="mr-2 h-4 w-4" />
            Interview
          </TabsTrigger>
          <TabsTrigger value="library">
            <BookCopy className="mr-2 h-4 w-4" />
            Library
          </TabsTrigger>
        </TabsList>
        <TabsContent value="interview" className="mt-6">
          <InterviewController
            userContext={userContext}
            jobApplications={jobApplications}
            apiKey={apiKey}
            onConfigureApiKey={() => setIsApiKeyDialogOpen(true)}
          />
        </TabsContent>
        <TabsContent value="library" className="mt-6 space-y-6">
          <UserContextEditor userContext={userContext} setUserContext={setUserContext} />
          <JobApplicationsManager jobApplications={jobApplications} setJobApplications={setJobApplications} />
        </TabsContent>
      </Tabs>
      <ApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </>
  );
}
