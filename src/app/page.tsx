"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, BrainCircuit, CheckCircle2, LayoutDashboard, Sparkles, Briefcase, Calendar, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/dashboard/StatCard";
import { JobCard } from "@/components/ui/job-board/JobCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      
      {/* STICKY NAVIGATION */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/50 dark:bg-slate-950/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-lg p-1.5 shadow-lg shadow-blue-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            JobFlow AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
             <SignInButton mode="modal">
                <Button variant="ghost" className="font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600">
                  Sign In
                </Button>
             </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 px-4 flex flex-col items-center text-center overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-8 relative z-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Resume Architect</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Land your dream job <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient bg-300%">
              without the chaos.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Organize applications, track interviews, and generate tailored, ATS-proof resumes in seconds.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <LayoutDashboard className="mr-2 w-5 h-5" />
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:-translate-y-1">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </motion.div>
        
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      </section>

      {/* 3. UI SHOWCASE SECTION */}
      <section className="py-24 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Command Center</h2>
            <p className="text-slate-500 mt-2">Everything you need to manage your job search in one view.</p>
          </div>

          {/* THE 3D TILTED INTERFACE */}
          <div className="perspective-1000 relative max-w-6xl mx-auto">
             
             {/* Main Dashboard Container Mockup */}
             <motion.div 
               initial={{ rotateX: 15, y: 50, opacity: 0 }}
               whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 pointer-events-none select-none"
             >
                {/* 1. Real Header (No more loading bars) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                   <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h3>
                      <p className="text-slate-500 text-sm mt-1">Manage your high-priority applications.</p>
                   </div>
                   <div className="h-10 px-4 bg-blue-600 rounded-lg flex items-center text-white text-sm font-medium shadow-lg shadow-blue-500/20">
                      <Plus className="w-4 h-4 mr-2" /> Add New Job
                   </div>
                </div>

                {/* 2. Mock Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                   <StatCard label="Total Applications" value={12} icon={<Briefcase className="w-6 h-6" />} color="blue" />
                   <StatCard label="Interviews" value={4} icon={<Calendar className="w-6 h-6" />} color="purple" isActive={true} />
                   <StatCard label="Offers" value={1} icon={<CheckCircle2 className="w-6 h-6" />} color="green" />
                   <StatCard label="In Progress" value={7} icon={<Clock className="w-6 h-6" />} color="orange" />
                </div>

                {/* 3. Mock Job Grid (Clean - No extra badges) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Card 1: Google */}
                   <JobCard 
                      id="1" index={0} 
                      title="Senior Software Engineer" company="Google" location="Mountain View, CA" 
                      status="INTERVIEW" date={new Date().toLocaleDateString()} 
                   />

                   {/* Card 2: Vercel */}
                   <div className="opacity-75">
                      <JobCard 
                        id="2" index={1} 
                        title="Frontend Developer" company="Vercel" location="Remote" 
                        status="OFFER" date={new Date(Date.now() - 86400000).toLocaleDateString()} 
                      />
                   </div>

                   {/* Card 3: Linear */}
                   <div className="opacity-50">
                      <JobCard 
                        id="3" index={2} 
                        title="Product Engineer" company="Linear" location="San Francisco" 
                        status="APPLIED" date={new Date(Date.now() - 172800000).toLocaleDateString()} 
                      />
                   </div>
                </div>

             </motion.div>
             
             {/* Glow Behind the Dashboard */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-500/10 blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
           <FeatureCard 
             title="Visual Pipeline" 
             desc="See exactly where you stand. Visualize your job search from application to offer in one clean dashboard."
             delay={0.2}
           />
           <FeatureCard 
             title="AI Resume Architect" 
             desc="Stop sending generic resumes. Our AI rewrites your bullet points to match the job description keywords instantly."
             delay={0.4}
           />
           <FeatureCard 
             title="Private & Secure" 
             desc="Your career data is your business. We use bank-level encryption and never share your data with recruiters."
             delay={0.6}
           />
        </div>
      </section>

    </div>
  );
}

// Sub-component for features
function FeatureCard({ title, desc, delay }: { title: string; desc: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-left group"
    >
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">
        <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}