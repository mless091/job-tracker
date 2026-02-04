// app/page.tsx
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">AI Job Tracker</h1>
      
      {/* Show this if logged OUT */}
      <SignedOut>
        <p className="mb-4">Please sign in to track your jobs.</p>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>

      {/* Show this if logged IN */}
      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <p>Welcome back!</p>
          <UserButton showName />
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </SignedIn>
    </div>
  );
}