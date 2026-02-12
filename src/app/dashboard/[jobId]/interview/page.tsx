import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, FileText } from "lucide-react";
import InterviewCoach from "@/components/ui/job-board/InterviewCoach";
import { Badge } from "@/components/ui/badge";

export default async function InterviewPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const { jobId } = await params;

  const job = await prisma.job.findUnique({ where: { id: jobId, userId } });
  if (!job) return notFound();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl h-[calc(100vh-4rem)] flex flex-col">
      {/* 1. Header Navigation */}
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href={`/dashboard/${jobId}`} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
             Interview Prep
             <Badge variant="outline" className="text-xs font-normal bg-purple-50 text-purple-700 border-purple-200">
               AI Powered
             </Badge>
           </h1>
           <p className="text-slate-500 text-sm flex items-center gap-2">
             <Building2 className="w-3 h-3" /> {job.company} 
             <span className="text-slate-300">•</span> 
             {job.position}
           </p>
        </div>
      </div>

      {/* 2. Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        
        {/* LEFT: Job Description (Scrollable Context) */}
        <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
               <h3 className="font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <FileText className="w-4 h-4" /> Job Description
               </h3>
            </div>
            <div className="p-6 overflow-y-auto prose prose-sm prose-slate dark:prose-invert max-w-none">
               <div className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                 {job.description}
               </div>
            </div>
        </div>

        {/* RIGHT: The Coach (Wide & Spacious) */}
        <div className="lg:col-span-2 overflow-y-auto pr-2 pb-10">
           <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Practice Questions</h2>
              <p className="text-slate-500">
                The AI has analyzed the job description on the left to generate these targeted questions.

                Sample answers based on your resume can be generated for comparison.
              </p>
           </div>

           {/* Reuse the exact same component, but now it has room! */}
           <InterviewCoach jobId={job.id} />
        </div>

      </div>
    </div>
  );
}