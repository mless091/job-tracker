import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Inter } from "next/font/google"; 
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Job Tracker",
//   description: "Track and optimize your job applications",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" // <--- FORCED DARK MODE
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
export const metadata: Metadata = {
  title: {
    template: "%s | JobFlow AI",
    default: "JobFlow AI - Intelligent Career Copilot", // Default if a page doesn't specify one
  },
  description: "Track applications, tailor resumes, and prepare for interviews with AI.",
  icons: {
    icon: "/icon.png", // Explicitly pointing if auto-detection fails
  },
};