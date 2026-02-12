"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils"; // Make sure you have this util, or remove if standard class strings work

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "blue" | "purple" | "green" | "orange";
  isActive?: boolean; // <--- NEW PROP
}

const colorStyles = {
  blue: {
    bg: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-800",
    activeRing: "ring-blue-500",
  },
  purple: {
    bg: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-800",
    activeRing: "ring-purple-500",
  },
  green: {
    bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-800",
    activeRing: "ring-emerald-500",
  },
  orange: {
    bg: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-800",
    activeRing: "ring-orange-500",
  },
};

export function StatCard({ label, value, icon, color = "blue", isActive = false }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className={`
          relative overflow-hidden h-full transition-all duration-300
          ${isActive ? `ring-2 ${styles.activeRing} shadow-md scale-[1.02]` : "border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800"} 
          bg-white/70 dark:bg-slate-900/70 backdrop-blur-md
        `}
      >
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
              {label}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {value}
            </h3>
          </div>
          
          <div className={`p-3 rounded-2xl ${styles.bg} shadow-sm`}>
            {icon}
          </div>
        </CardContent>
        
        {/* Decorative Bottom Line (Always visible, brighter when active) */}
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 text-${color}-500`} />
      </Card>
    </motion.div>
  );
}