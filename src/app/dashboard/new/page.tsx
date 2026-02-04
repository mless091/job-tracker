// app/dashboard/new/page.tsx
import { createJob } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Track New Job</CardTitle>
          <CardDescription>
            Paste the job details below. We'll use this later for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* THE FORM STARTS HERE */}
          <form action={createJob} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input 
                  id="company" 
                  name="company" 
                  placeholder="e.g. Google" 
                  required 
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Position Title</Label>
                <Input 
                  id="position" 
                  name="position" 
                  placeholder="e.g. Senior Software Engineer" 
                  required 
                />
              </div>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="listingUrl">Job Listing URL</Label>
              <Input 
                id="listingUrl" 
                name="listingUrl" 
                placeholder="https://linkedin.com/jobs/..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  placeholder="e.g. Remote / New York" 
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input 
                  id="salary" 
                  name="salary" 
                  placeholder="e.g. $120k - $150k" 
                />
              </div>
            </div>

            {/* Description (The most important part for AI) */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Paste the full job description here..." 
                className="min-h-[200px]" 
              />
              <p className="text-xs text-muted-foreground">
                Paste the full text here. This will be used to generate your tailored resume.
              </p>
            </div>

            <Button type="submit" className="w-full">
              Save Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}