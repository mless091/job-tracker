"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

export function JobFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current status from URL or default to "all"
  const currentStatus = searchParams.get("status") || "all";

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="relative">
       {/* Icon positioned absolute so it sits inside the select trigger visually if needed, 
           or just use the SelectTrigger's built-in capability */}
      <Select value={currentStatus} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
             <Filter className="w-4 h-4" />
             <SelectValue placeholder="Filter by Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Jobs</SelectItem>
          <SelectItem value="SAVED">Saved</SelectItem>
          <SelectItem value="APPLIED">Applied</SelectItem>
          <SelectItem value="INTERVIEW">Interview</SelectItem>
          <SelectItem value="OFFER">Offer</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}