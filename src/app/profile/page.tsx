// app/profile/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser(); // Get details like email
  if (!userId) redirect("/");

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
            <p className="text-xs text-muted-foreground">Managed by Clerk</p>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium">Master Resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your base resume. The AI will use this to generate tailored versions for each job application.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               <Button variant="outline" className="w-full h-32 border-dashed flex flex-col gap-2">
                 <Upload className="h-8 w-8 text-muted-foreground" />
                 <span>Upload PDF (Coming Soon)</span>
               </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}