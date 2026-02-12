"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessagesSquare, Sparkles, ChevronDown, ChevronUp, Loader2, Mic, BookOpen } from "lucide-react";
import { generateInterviewPrep, generateInterviewAnswer } from "@/app/ai-actions";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question: string;
  hint: string;
}

export default function InterviewCoach({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // New State for Answers
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loadingAnswer, setLoadingAnswer] = useState<Record<number, boolean>>({});

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const json = await generateInterviewPrep(jobId);
      const cleanJson = json.replace(/```json/g, "").replace(/```/g, "").trim();
      setQuestions(JSON.parse(cleanJson).questions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnswer = async (index: number, question: string) => {
    setLoadingAnswer(prev => ({ ...prev, [index]: true }));
    try {
      const answer = await generateInterviewAnswer(jobId, question);
      setAnswers(prev => ({ ...prev, [index]: answer }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAnswer(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 mt-6 ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessagesSquare className="w-5 h-5 text-purple-500" />
          AI Interview Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        
        {!questions && !loading && (
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-500">
              Generate 4 likely interview questions based on this specific job description.
            </p>
            <Button onClick={handleGenerateQuestions} className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Questions
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-8 space-y-3">
             <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
             <p className="text-sm text-slate-500 animate-pulse">Thinking like a hiring manager...</p>
          </div>
        )}

        {questions && (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div 
                key={i} 
                className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                  openIndex === i 
                    ? "border-purple-200 dark:border-purple-900 ring-1 ring-purple-100 dark:ring-purple-900/30" 
                    : "border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900"
                }`}
              >
                {/* 1. THE TRIGGER BUTTON (Now clearly interactive) */}
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full flex items-start justify-between p-4 text-left transition-colors group ${
                    openIndex === i ? "bg-purple-50/50 dark:bg-purple-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className={`font-medium text-sm pr-4 mt-1 transition-colors ${
                    openIndex === i ? "text-purple-900 dark:text-purple-100" : "text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400"
                  }`}>
                    {q.question}
                  </span>
                  
                  {/* The Action Icon (Chevron) */}
                  <div className={`flex-shrink-0 p-1.5 rounded-full transition-all duration-200 ${
                    openIndex === i 
                      ? "bg-purple-100 text-purple-600 rotate-180" 
                      : "bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600"
                  }`}>
                     <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white dark:bg-slate-950"
                    >
                      <div className="p-4 border-t border-purple-100 dark:border-purple-900/30 space-y-4">
                         
                         {/* 2. The Hint */}
                         <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                            <strong className="text-purple-600 text-xs uppercase tracking-wide block mb-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Key Talking Points
                            </strong>
                            {q.hint}
                         </div>

                         {/* 3. The Answer Section */}
                         {answers[i] ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 p-4 rounded-lg shadow-sm"
                            >
                               <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded-md">
                                      <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-300" />
                                    </div>
                                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">Suggested Response</span>
                                  </div>
                               </div>
                               <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                                 {answers[i]}
                               </p>
                            </motion.div>
                         ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleGenerateAnswer(i, q.question)}
                              disabled={loadingAnswer[i]}
                              className="w-full mt-1 border-dashed border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-solid dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20 h-10"
                            >
                              {loadingAnswer[i] ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Writing personalized answer...
                                </>
                              ) : (
                                <>
                                  <Mic className="w-4 h-4 mr-2" /> Generate Sample Answer (STAR Method)
                                </>
                              )}
                            </Button>
                         )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            <Button variant="ghost" size="sm" onClick={() => { setQuestions(null); setAnswers({}); }} className="w-full text-slate-400 hover:text-slate-600 mt-2">
              Clear & Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}