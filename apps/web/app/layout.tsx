import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const sans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "variable",
});

const mono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "variable",
});

export const metadata: Metadata = {
  description: "A Next.js starter for eve agents with AI Elements.",
  title: "eve Next.js Starter",
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html className={cn(sans.variable, mono.variable)} lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
