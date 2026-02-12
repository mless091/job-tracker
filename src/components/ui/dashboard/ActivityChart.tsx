"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { format, subDays, isSameDay } from "date-fns";

export function ActivityChart({ jobs }: { jobs: any[] }) {
  // 1. Generate last 14 days of data (placeholder for "velocity")
  const data = Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i); // Go back 13 days + today
    const count = jobs.filter((job) => isSameDay(new Date(job.createdAt), date)).length;
    return {
      date: format(date, "MMM dd"), // e.g. "Oct 24"
      count: count,
    };
  });

  return (
    <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-800 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
          Application Velocity
        </CardTitle>
        <p className="text-sm text-slate-500">Your activity over the last 2 weeks.</p>
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                minTickGap={30}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}