import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Calendar, CheckCircle, Clock, UserCircle, SearchX } from "lucide-react";
import SearchInput from "@/components/ui/job-board/SearchInput";
import { StatCard } from "@/components/ui/dashboard/StatCard";
import { JobCard } from "@/components/ui/job-board/JobCard";
import { JobFilter } from "@/components/ui/job-board/JobFilter";
import { ActivityChart } from "@/components/ui/dashboard/ActivityChart";


export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const query = params.query || "";
  const statusFilter = params.status || "";

  // Fetch ALL jobs for Global Stats & Chart
  const allJobs = await prisma.job.findMany({
    where: { userId },
    select: { status: true, createdAt: true }, 
  });

  const totalCount = allJobs.length;
  const interviewCount = allJobs.filter((j) => ["INTERVIEW", "Interview", "interview"].includes(j.status)).length;
  const offerCount = allJobs.filter((j) => ["OFFER", "Offer", "offer"].includes(j.status)).length;
  const appliedCount = allJobs.filter((j) => ["APPLIED", "Applied", "applied"].includes(j.status)).length;

  // Fetch FILTERED jobs for the Card Grid
  const whereClause: any = {
    userId,
    OR: [
      { company: { contains: query, mode: "insensitive" } },
      { position: { contains: query, mode: "insensitive" } },
    ],
  };

  if (statusFilter) {
    whereClause.status = {
      equals: statusFilter,
      mode: "insensitive",
    };
  }

  const displayJobs = await prisma.job.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      
      {/*  HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage your high-priority applications.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <Link href="/profile">
                <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <UserCircle className="mr-2 h-5 w-5" />
                    Profile
                </Button>
            </Link>

            <Link href="/dashboard/new">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                    <Plus className="mr-2 h-5 w-5" /> Add New Job
                </Button>
            </Link>
        </div>
      </div>

      {/* STATS & CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Left Column: Stat Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard" className="block h-full">
                <StatCard 
                    label="Total Jobs" 
                    value={totalCount} 
                    icon={<Briefcase className="w-6 h-6" />} 
                    color="blue" 
                    isActive={!statusFilter} 
                />
            </Link>

            <Link href="/dashboard?status=APPLIED" className="block h-full">
                <StatCard 
                    label="In Progress" 
                    value={appliedCount} 
                    icon={<Clock className="w-6 h-6" />} 
                    color="orange" 
                    isActive={statusFilter === "APPLIED"}
                />
            </Link>

            <Link href="/dashboard?status=INTERVIEW" className="block h-full">
                <StatCard 
                    label="Interviews" 
                    value={interviewCount} 
                    icon={<Calendar className="w-6 h-6" />} 
                    color="purple" 
                    isActive={statusFilter === "INTERVIEW"}
                />
            </Link>

            <Link href="/dashboard?status=OFFER" className="block h-full">
                <StatCard 
                    label="Offers" 
                    value={offerCount} 
                    icon={<CheckCircle className="w-6 h-6" />} 
                    color="green" 
                    isActive={statusFilter === "OFFER"}
                />
            </Link>
        </div>

        {/* Right Column: Velocity Chart */}
        <div className="lg:col-span-1 h-full min-h-[250px]">
            <ActivityChart jobs={allJobs} />
        </div>
      </div>

      {/* CONTROL BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
           <SearchInput />
        </div>
        <JobFilter />
      </div>

      {/* JOB GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayJobs.map((job, index) => (
          <JobCard
            key={job.id}
            id={job.id}
            index={index}
            title={job.position}
            company={job.company}
            location={job.location || ""}
            status={job.status}
            date={job.createdAt.toString()}
          />
        ))}
        
        {/* IMPROVED EMPTY STATE */}
        {displayJobs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4 shadow-sm">
                   <SearchX className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                   No jobs found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                   We couldn't find any applications matching your current filters. Try adjusting your search or clear your filters to see everything.
                </p>
                
                {(statusFilter || query) && (
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-white hover:text-blue-600 dark:hover:bg-slate-800 transition-colors">
                       Clear all filters
                    </Button>
                  </Link>
                )}
            </div>
        )}
      </div>
    </div>
  );
}