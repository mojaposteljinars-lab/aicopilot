"use client";

import { CopilotHUD } from "@/components/interview/CopilotHUD";
import { useEffect, useState } from "react";
import type { JobContext, UserContext } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

export default function InterviewHUDPage() {
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [userContext, setUserContext] = useState<UserContext | null>(null);
    const [jobContext, setJobContext] = useState<JobContext | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            // TODO: This is a temporary solution for testing. Replace with a secure key management strategy.
            const storedApiKey = 'f273273f25d2817bf3d670b59a22f0f585d6bf5d';
            const storedUserContext = localStorage.getItem('interview_userContext');
            const storedJobContext = localStorage.getItem('interview_jobContext');

            if (!storedApiKey || !storedUserContext || !storedJobContext) {
                setError("Could not load interview session data. Please close this window and start again.");
                return;
            }

            setApiKey(storedApiKey);
            setUserContext(JSON.parse(storedUserContext));
            setJobContext(JSON.parse(storedJobContext));

            // Cleanup localStorage
            localStorage.removeItem('interview_apiKey');
            localStorage.removeItem('interview_userContext');
            localStorage.removeItem('interview_jobContext');

        } catch (e) {
            setError("Failed to parse session data. Please close this window and start again.");
            console.error(e);
        }
    }, []);

    const getTabAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: { suppressLocalAudioPlayback: false },
            });
            
            // We don't need the video track, stop it to save resources
            stream.getVideoTracks().forEach(track => track.stop());

            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length > 0) {
                // When the user stops sharing the tab, close the popup
                audioTracks[0].onended = () => window.close();
                setAudioStream(stream);
            } else {
                 // No audio track was found. Stop all tracks and show an error.
                stream.getTracks().forEach(track => track.stop());
                setError("No audio track found in the selected source. Please ensure you share a browser tab and enable 'Share tab audio'.");
            }
        } catch (err) {
            console.error("Error accessing tab audio:", err);
            setError("Permission to share audio was denied. Please close this window, try again, and grant the necessary permissions.");
            // Close the window automatically if permission is denied
            setTimeout(() => window.close(), 5000);
        }
    };
    
    useEffect(() => {
        if(apiKey && userContext && jobContext) {
            getTabAudio();
        }
    }, [apiKey, userContext, jobContext]);

    const handleStopSession = () => {
        audioStream?.getTracks().forEach(track => track.stop());
        window.close();
    };

    const isReady = audioStream && apiKey && userContext && jobContext;

    if (!isReady) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background">
                <Card className="w-96">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center">
                            {error ? (
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            ) : (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <p>Waiting for you to select a tab to share...</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <CopilotHUD
            audioStream={audioStream}
            apiKey={apiKey}
            userContext={userContext}
            jobContext={jobContext}
            onStopSession={handleStopSession}
        />
    );
}
