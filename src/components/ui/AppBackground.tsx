"use client";

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 relative overflow-x-hidden selection:bg-blue-500/30">
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}