"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { JobContext } from "@/lib/types";
import { Plus, Edit, Trash, Briefcase, FileText, Building, CalendarDays } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobApplicationsManagerProps {
  jobApplications: JobContext[];
  setJobApplications: (jobs: JobContext[]) => void;
}

export function JobApplicationsManager({ jobApplications, setJobApplications }: JobApplicationsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobContext | null>(null);
  const { toast } = useToast();

  const handleSaveJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobData = {
      companyName: formData.get("companyName") as string,
      jobDescription: formData.get("jobDescription") as string,
    };

    if (editingJob) {
      const updatedJobs = jobApplications.map((job) =>
        job.id === editingJob.id ? { ...job, ...jobData } : job
      );
      setJobApplications(updatedJobs);
      toast({ title: "Job Updated", description: `Details for ${jobData.companyName} have been saved.` });
    } else {
      const newJob: JobContext = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...jobData
      };
      setJobApplications([newJob, ...jobApplications]);
      toast({ title: "Job Added", description: `${jobData.companyName} has been added to your library.` });
    }

    setEditingJob(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (job: JobContext) => {
    setEditingJob(job);
    setIsDialogOpen(true);
  };

  const handleDelete = (jobId: string) => {
    setJobApplications(jobApplications.filter((job) => job.id !== jobId));
    toast({ title: "Job Deleted", variant: "destructive", description: "The job application has been removed." });
  };
  
  const openNewJobDialog = () => {
    setEditingJob(null);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Job Applications
          </CardTitle>
          <CardDescription>
            Save job descriptions to get AI answers tailored to specific roles.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewJobDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit" : "Add New"} Job Application</DialogTitle>
              <DialogDescription>
                Provide the company name and job description for tailored responses.
              </DialogDescription>
            </DialogHeader>
            <form id="job-form" onSubmit={handleSaveJob} className="space-y-4 py-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" defaultValue={editingJob?.companyName} required />
              </div>
              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea id="jobDescription" name="jobDescription" defaultValue={editingJob?.jobDescription} required className="h-48 font-code text-sm"/>
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" form="job-form">Save Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobApplications.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobApplications.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-4 w-4 shrink-0 text-muted-foreground"/> {job.companyName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <CalendarDays className="h-3 w-3" /> Added {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 shrink-0 mt-1" />
                  <span className="line-clamp-3">{job.jobDescription}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)} className="text-destructive hover:text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No job applications saved yet.</p>
            <p className="text-sm">Click "Add Job" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
