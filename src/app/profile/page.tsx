// app/profile/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import ResumeUploader from "@/components/ui/job-board/ResumeUploader"; // <--- Import New Component
import AiResumeGenerator from "@/components/ui/job-board/AiResumeGenerator";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) redirect("/");

  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });

console.log("👀 PAGE SEES URL:", prefs?.masterResumeUrl);

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your master resume and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input value={user?.emailAddresses[0].emailAddress} disabled />
          </div>

          <div className="border-t pt-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium">Master Resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your base resume. The AI will use this to generate tailored versions.
              </p>
            </div>
            
           {/* DISPLAY EXISTING RESUME */}
            {prefs?.masterResumeUrl ? (
              <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/50">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">Current Master Resume</p>
                  <a 
                                      href={prefs.masterResumeUrl} // <--- Clean URL again
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-muted-foreground hover:underline"
                                  >
                                      View PDF
                                  </a>
                </div>
                <div className="text-xs text-green-500 font-medium">Active</div>
              </div>
            ) : null}

            {/* NEW UPLOADER COMPONENT */}
            <Label>Update Resume (PDF only)</Label>
            <ResumeUploader />
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}