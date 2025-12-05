"use client";

import { useState } from 'react';
import type { JobContext, UserContext } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CopilotHUD } from '@/components/interview/CopilotHUD';
import { Bot, Briefcase, FileWarning, Play, Info } from 'lucide-react';

interface InterviewControllerProps {
  userContext: UserContext;
  jobApplications: JobContext[];
  apiKey: string;
  onConfigureApiKey: () => void;
}

export function InterviewController({
  userContext,
  jobApplications,
  apiKey,
  onConfigureApiKey,
}: InterviewControllerProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const startSession = () => {
    if (apiKey && userContext.resume && selectedJobId) {
      setIsSessionActive(true);
    }
  };

  const stopSession = () => {
    setIsSessionActive(false);
  };
  
  const selectedJob = jobApplications.find(job => job.id === selectedJobId);

  if (isSessionActive && selectedJob) {
    return (
      <CopilotHUD
        apiKey={apiKey}
        userContext={userContext}
        jobContext={selectedJob}
        onStopSession={stopSession}
      />
    );
  }

  return (
    <div className="space-y-6">
      {!apiKey || !userContext.resume ? (
         <Alert variant="destructive">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Configuration Incomplete</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Please complete the following steps before starting an interview:</p>
              <ul className="list-disc pl-5">
                {!apiKey && <li>Set your Gemini API key in the Library tab.</li>}
                {!userContext.resume && <li>Add your resume in the Library's "My Profile" section.</li>}
              </ul>
              <Button variant="secondary" onClick={onConfigureApiKey}>Configure API Key</Button>
            </AlertDescription>
          </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Start New Session
          </CardTitle>
          <CardDescription>
            Select a job application to start your AI-assisted interview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Job</label>
            <Select onValueChange={setSelectedJobId} value={selectedJobId ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job application..." />
              </SelectTrigger>
              <SelectContent>
                {jobApplications.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={startSession} 
            disabled={!apiKey || !userContext.resume || !selectedJobId}
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Interview Session
          </Button>

        </CardContent>
      </Card>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Stealth Tip</AlertTitle>
        <AlertDescription>
          During your interview, only share your browser tab, not your entire screen, to keep InterviewAce hidden from the interviewer.
        </AlertDescription>
      </Alert>
    </div>
  );
}
