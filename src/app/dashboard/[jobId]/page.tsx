import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, ExternalLink, MapPin, Banknote, Calendar, Building2, Sparkles, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteJob } from "@/app/actions";
import StatusSelect from "@/components/ui/job-board/StatusSelect";
import AiResumeGenerator from "@/components/ui/job-board/AiResumeGenerator";

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  
  // 1. Await the params to get the ID
  const { jobId } = await params;

  // 2. Fetch Job Data
  const job = await prisma.job.findUnique({ 
    where: { 
      id: jobId, 
      userId 
    } 
  });
  
  // 3. Fetch User Preferences to check for Master Resume
  const prefs = await prisma.userPreferences.findUnique({ 
    where: { userId },
    select: { masterResumeUrl: true }
  });

  if (!job) return notFound();

  // 4. Determine if they have a resume uploaded
  const hasResume = !!prefs?.masterResumeUrl;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Back Button */}
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Job Info & Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{job.position}</h1>
                <div className="flex items-center gap-2 text-xl text-slate-500 font-medium">
                  <Building2 className="w-5 h-5" /> {job.company}
                </div>
              </div>
              <StatusSelect id={job.id} currentStatus={job.status} />
            </div>

            <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
               {job.location && (
                 <div className="flex items-center text-sm text-slate-500">
                   <MapPin className="w-4 h-4 mr-2" /> {job.location}
                 </div>
               )}
               {job.salary && (
                 <div className="flex items-center text-sm text-slate-500">
                   <Banknote className="w-4 h-4 mr-2" /> {job.salary}
                 </div>
               )}
               <div className="flex items-center text-sm text-slate-500">
                 <Calendar className="w-4 h-4 mr-2" /> Applied: {new Date(job.createdAt).toLocaleDateString()}
               </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Job Description</h3>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                {job.description || "No description provided."}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Tools & Actions */}
        <div className="space-y-6">
          
          {/* 1. Resume Generator (Checks for master resume) */}
          <AiResumeGenerator jobId={job.id} hasMasterResume={hasResume} />

          {/* 2. Link to Dedicated Interview Page */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                 <MessagesSquare className="w-24 h-24 transform rotate-12 translate-x-4 -translate-y-4" />
              </div>
              <CardContent className="p-6 relative z-10">
                 <div className="mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-purple-200" />
                       Interview Coach
                    </h3>
                    <p className="text-purple-100 text-sm mt-1">
                       Prepare for this specific role with AI-generated questions and sample answers.
                    </p>
                 </div>
                 <Link href={`/dashboard/${job.id}/interview`}>
                    <Button variant="secondary" className="w-full bg-white text-purple-700 hover:bg-purple-50 border-0 font-semibold shadow-md">
                       Start Prep Session
                    </Button>
                 </Link>
              </CardContent>
          </Card>

          {/* 3. Quick Actions Card */}
          <Card className="border-0 shadow-lg bg-slate-900 text-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">Quick Actions</h3>
              
              {job.listingUrl && (
                <a href={job.listingUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-white border-0 justify-start mb-3">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Original Listing
                  </Button>
                </a>
              )}

              <form action={deleteJob}>
                <input type="hidden" name="jobId" value={job.id} />
                <Button variant="destructive" className="w-full justify-start bg-red-500/20 hover:bg-red-500/30 text-red-200 border-0" type="submit">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}