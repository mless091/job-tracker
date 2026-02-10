// app/dashboard/[jobId]/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, ExternalLink, MapPin, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteJob } from "@/app/actions";
import StatusSelect from "@/components/ui/job-board/StatusSelect";
import AiResumeGenerator from "@/components/ui/job-board/AiResumeGenerator";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>; // <--- 1. Type is now a Promise
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 2. Await the params to get the ID
  const { jobId } = await params; 

  const job = await prisma.job.findUnique({
    where: {
      id: jobId, // Now this has the actual string value
      userId,
    },
  });

  if (!job) return notFound();

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <form action={deleteJob}>
          <input type="hidden" name="jobId" value={job.id} />
          <Button variant="destructive" size="sm" type="submit">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Job
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{job.position}</h1>
                  <h2 className="text-xl text-muted-foreground">{job.company}</h2>
                </div>
                <StatusSelect id={job.id} currentStatus={job.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {job.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {job.location}
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center">
                    <Banknote className="mr-1 h-4 w-4" />
                    {job.salary}
                  </div>
                )}
                <div className="flex items-center">
                   Applied: {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="border-t pt-4">
  <h3 className="font-semibold mb-2">Job Description</h3>
  {/* OLD: bg-gray-50 text-gray-700 */}
  {/* NEW: bg-muted text-foreground (Auto-adapts to dark mode) */}
  <div className="whitespace-pre-wrap text-sm text-foreground bg-muted p-4 rounded-md border border-border">
    {job.description || "No description provided."}
  </div>
</div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: ACTIONS & AI */}
        <div className="space-y-6">
          {/* AI GENERATOR CARD */}
          <AiResumeGenerator jobId={job.id} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.listingUrl && (
                <a 
                  href={job.listingUrl.startsWith('http') ? job.listingUrl : `https://${job.listingUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Original Listing
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}