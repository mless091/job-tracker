import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Upload, ShieldCheck } from "lucide-react";
import Link from "next/link";
import ResumeUploader from "@/components/ui/job-board/ResumeUploader";

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) redirect("/");

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  const hasResume = !!prefs?.masterResumeUrl;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile & Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and master resume.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: User Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-800">
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="rounded-full border-4 border-white dark:border-slate-800 shadow-sm"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-slate-500">{user.emailAddresses[0].emailAddress}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex justify-center gap-4 text-sm text-slate-500">
                <div className="flex flex-col items-center">
                   <ShieldCheck className="w-5 h-5 text-blue-500 mb-1" />
                   <span>Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Resume Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Master Resume Card */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Master Resume
              </CardTitle>
              <CardDescription>
                Upload your base PDF. The AI will use this as a source of truth to generate tailored versions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Status Indicator */}
              <div className={`p-4 rounded-lg border flex items-start gap-3 ${hasResume ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900'}`}>
                 <div className={`p-1.5 rounded-full ${hasResume ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {hasResume ? <ShieldCheck className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                 </div>
                 <div>
                    <h4 className={`font-semibold text-sm ${hasResume ? 'text-green-900 dark:text-green-300' : 'text-amber-900 dark:text-amber-300'}`}>
                        {hasResume ? "Master Resume Active" : "No Resume Found"}
                    </h4>
                    <p className={`text-xs mt-1 ${hasResume ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {hasResume 
                          ? "Your resume is on file and ready for AI tailoring." 
                          : "You need to upload a resume before using the AI features."}
                    </p>
                    {hasResume && (
                       // FIX APPLIED HERE: Added '|| ""' to fallback if null
                       <a href={prefs?.masterResumeUrl || ""} target="_blank" className="text-xs font-medium underline mt-2 block hover:opacity-80">
                          View Current PDF
                       </a>
                    )}
                 </div>
              </div>

              {/* The Upload Component */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="text-sm font-medium mb-4 text-slate-900 dark:text-white">Update Resume</h4>
                  <ResumeUploader />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}