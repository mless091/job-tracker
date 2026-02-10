"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Download, Check, BrainCircuit } from "lucide-react";
import { generateTailoredResume } from "@/app/ai-actions";
import { toast } from "sonner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDocument, ResumeData } from "./ResumeDocument";
import { motion, AnimatePresence } from "framer-motion";

// --- SHIMMER BUTTON COMPONENT ---
const ShimmerButton = ({ onClick, disabled, children, icon: Icon }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="group relative w-full overflow-hidden rounded-lg bg-slate-900 p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#50a6ff_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-8 py-3 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900 gap-2">
      {Icon && <Icon className="h-4 w-4 text-blue-400" />}
      {children}
    </span>
  </button>
);

export default function AiResumeGenerator({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Extracting resume data...",
    "Analyzing requirements...",
    "Matching keywords...",
    "Optimizing bullet points...",
    "Finalizing PDF layout..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500); 
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [loading]);

  const handleGenerate = async () => {
    setLoading(true);
    setResumeData(null); 
    
    try {
      const jsonString = await generateTailoredResume(jobId);
      const cleanJson = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanJson);
      setResumeData(parsedData);
      toast.success("Optimization Complete");
    } catch (error: any) {
      toast.error("Generation failed", { description: "Please try again." });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-xl mx-auto"
    >
      <Card className="overflow-hidden border-0 shadow-2xl bg-white/50 dark:bg-slate-950/50 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-800">
        
        {/* Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            
            {/* --- ICON HEADER --- */}
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-inner">
              <BrainCircuit className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              AI Resume Architect
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-sm leading-relaxed">
              Generate a targeted, single-page resume optimized for this specific job description.
            </p>

            <AnimatePresence mode="wait">
              {/* STATE 1: IDLE */}
              {!loading && !resumeData && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <ShimmerButton onClick={handleGenerate} icon={Sparkles}>
                    Generate Tailored Resume
                  </ShimmerButton>
                </motion.div>
              )}

              {/* STATE 2: LOADING (AI THINKING) */}
              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full space-y-4"
                >
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 8, ease: "linear" }} 
                    />
                  </div>
                  
                  <div className="h-6 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={loadingStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 absolute inset-0 flex justify-center items-center gap-2"
                      >
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {loadingMessages[loadingStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* STATE 3: SUCCESS */}
              {!loading && resumeData && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-4"
                >
                  <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 p-4 flex items-start gap-3">
                    <div className="rounded-full bg-white dark:bg-green-900 p-1 shadow-sm">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-green-900 dark:text-green-100">
                        Optimization Complete
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Tailored for you.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <Button 
                        variant="outline" 
                        onClick={() => setResumeData(null)}
                        className="w-full"
                      >
                        Reset
                      </Button>

                    <PDFDownloadLink
                      document={<ResumeDocument data={resumeData} />}
                      fileName={`Tailored_Resume_${resumeData.fullName.replace(/ /g, "_")}.pdf`}
                      className="w-full"
                    >
                      {({ loading: pdfLoading }) => (
                        <Button 
                          className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2 px-4" 
                          disabled={pdfLoading}
                        >
                          {/* FIX: Reduced margin from mr-2 to mr-1 and used gap-2 on parent for better control */}
                          <Download className="h-4 w-4" /> 
                          <span>{pdfLoading ? "Building..." : "Download"}</span>
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}