"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Download, Check, BrainCircuit, FileWarning, ArrowRight } from "lucide-react";
import { generateTailoredResume } from "@/app/ai-actions";
import { toast } from "sonner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDocument, ResumeData } from "./ResumeDocument";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ShimmerButton = ({ onClick, disabled, children, icon: Icon }: any) => (
  <button onClick={onClick} disabled={disabled} className="group relative w-full overflow-hidden rounded-lg bg-slate-900 p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50">
    <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#50a6ff_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-8 py-3 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900 gap-2">
      {Icon && <Icon className="h-4 w-4 text-blue-400" />} {children}
    </span>
  </button>
);

// Added 'hasMasterResume' prop
export default function AiResumeGenerator({ jobId, hasMasterResume }: { jobId: string, hasMasterResume: boolean }) {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [step, setStep] = useState(0);
  const messages = ["Analyzing Job...", "Extracting Keywords...", "Optimizing Resume...", "Finalizing PDF..."];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => setStep((p) => (p + 1) % messages.length), 1500);
      return () => clearInterval(interval);
    }
    setStep(0);
  }, [loading]);

  const handleGenerate = async () => {
    setLoading(true); setResumeData(null);
    try {
      const json = await generateTailoredResume(jobId);
      setResumeData(JSON.parse(json.replace(/```json/g, "").replace(/```/g, "").trim()));
      toast.success("Optimization Complete");
    } catch (e) { toast.error("Generation Failed", { description: "Make sure you have a Master Resume uploaded." }); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <Card className="overflow-hidden border-0 shadow-xl bg-white/50 dark:bg-slate-950/50 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <CardContent className="p-8 text-center">
          <div className="mb-6 rounded-2xl bg-blue-50 dark:bg-slate-900 p-4 inline-block shadow-inner">
            <BrainCircuit className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI Resume Architect</h2>
          <p className="text-slate-500 text-sm mb-8">Generate a targeted, single-page resume optimized for this job.</p>

          {/* CHECK: Do we have a resume? */}
          {!hasMasterResume ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-4"
             >
               <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/10 p-4 text-center space-y-2">
                 <div className="flex justify-center mb-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <FileWarning className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                 </div>
                 <h3 className="font-semibold text-amber-900 dark:text-amber-100">Missing Master Resume</h3>
                 <p className="text-xs text-amber-700 dark:text-amber-300 max-w-[220px] mx-auto">
                   Upload your base PDF in your profile to enable AI tailoring.
                 </p>
               </div>
               
               <Link href="/profile" className="block w-full">
                 <Button variant="outline" className="w-full border-amber-200 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-900/20">
                   Go to Profile <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
               </Link>
             </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {!loading && !resumeData && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ShimmerButton onClick={handleGenerate} icon={Sparkles}>Generate Tailored Resume</ShimmerButton>
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><motion.div className="h-full bg-blue-600" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6 }} /></div>
                  <p className="text-sm font-medium text-blue-600 flex justify-center items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> {messages[step]}</p>
                </motion.div>
              )}
              {!loading && resumeData && (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-3"><Check className="h-4 w-4 text-green-600" /><span className="text-sm font-semibold text-green-900">Optimization Complete</span></div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setResumeData(null)}>Reset</Button>
                    <PDFDownloadLink document={<ResumeDocument data={resumeData} />} fileName="Tailored_Resume.pdf" className="w-full">
                      {({ loading: l }) => <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={l}><Download className="h-4 w-4 mr-2" />{l ? "Building..." : "Download"}</Button>}
                    </PDFDownloadLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </CardContent>
      </Card>
    </motion.div>
  );
}