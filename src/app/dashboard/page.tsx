// app/dashboard/page.tsx (Replace the SortableHeader and DashboardPage)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, UserCircle, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import SearchInput from "@/components/ui/job-board/SearchInput";
import { Job } from "@prisma/client"; // <--- Add this line

// --- NEW ROBUST HEADER COMPONENT ---
function SortableHeader({ 
  column, 
  label, 
  currentSort, 
  currentOrder 
}: { 
  column: string, 
  label: string, 
  currentSort: string, 
  currentOrder: string 
}) {
  const isActive = currentSort === column;
  
  // Logic: If active and 'asc', go 'desc'. Otherwise 'asc'.
  const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";
  
  // Icon Logic
  let Icon = ArrowUpDown;
  if (isActive) {
    Icon = currentOrder === "asc" ? ArrowUp : ArrowDown;
  }

  return (
    <Link 
      href={`/dashboard?sort=${column}&order=${nextOrder}`} 
      className={`flex items-center hover:text-primary transition-colors ${isActive ? "text-primary font-bold" : "text-muted-foreground"}`}
    >
      {label}
      <Icon className="ml-2 h-3 w-3" />
    </Link>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; sort?: string; order?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const query = params.query || "";
  const sort = params.sort || "createdAt";
  const order = params.order || "desc"; // Default to newest first

  // Validation: Prisma only accepts 'asc' or 'desc'. 
  // If someone messes with the URL, fallback to 'desc'.
  const validOrder = order === "asc" ? "asc" : "desc";

  const jobs = await prisma.job.findMany({
    where: {
      userId,
      OR: [
        { company: { contains: query, mode: "insensitive" } },
        { position: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: {
      [sort]: validOrder, // <--- Dynamic Sort Direction
    },
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground">Manage and track your job search progress.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/profile">
            <Button variant="outline">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link href="/dashboard/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Job
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Your Pipeline</CardTitle>
              <CardDescription>Found {jobs.length} applications.</CardDescription>
            </div>
            <SearchInput />
          </div>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 && !query ? (
             <div className="text-center py-10 text-muted-foreground">No jobs tracked yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader column="company" label="Company" currentSort={sort} currentOrder={validOrder} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="position" label="Position" currentSort={sort} currentOrder={validOrder} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="status" label="Status" currentSort={sort} currentOrder={validOrder} />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <SortableHeader column="createdAt" label="Date Applied" currentSort={sort} currentOrder={validOrder} />
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job: Job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.company}</TableCell>
                    <TableCell>{job.position}</TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/${job.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SAVED: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    APPLIED: "bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25",
    INTERVIEW: "bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/25",
    OFFER: "bg-green-500/15 text-green-700 dark:text-green-300 hover:bg-green-500/25",
    REJECTED: "bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-500/25",
  };
  return <Badge className={`${styles[status] || "bg-secondary"} border-0`}>{status}</Badge>;
}