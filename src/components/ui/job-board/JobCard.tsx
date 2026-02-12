"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "OFFER": return "bg-green-100 text-green-700 border-green-200";
    case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
    case "INTERVIEW": return "bg-purple-100 text-purple-700 border-purple-200";
    default: return "bg-blue-100 text-blue-700 border-blue-200";
  }
};

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location?: string;
  status: string;
  date: string;
  index: number;
}

export function JobCard({ id, title, company, location, status, date, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/dashboard/${id}`} className="block h-full group">
        <Card className="h-full relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 opacity-0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 group-hover:opacity-100 transition-all duration-500" />
          <CardContent className="p-6 flex flex-col h-full relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-300 shadow-inner ring-1 ring-slate-200 dark:ring-slate-700">
                {company.charAt(0)}
              </div>
              <Badge variant="outline" className={`${getStatusStyles(status)} px-3 py-1 capitalize border shadow-sm`}>{status}</Badge>
            </div>
            <div className="mb-6 flex-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2">{title}</h3>
              <div className="space-y-1 text-sm text-slate-500">
                <div className="flex items-center"><Building2 className="w-4 h-4 mr-2" /> {company}</div>
                {location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {location}</div>}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center text-xs text-slate-400"><Calendar className="w-3 h-3 mr-1" /> {new Date(date).toLocaleDateString()}</div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 flex items-center text-sm font-medium">
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}