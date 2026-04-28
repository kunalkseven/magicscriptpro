import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CreatorAI Pro — AI Content Engine for Indian Creators",
  description:
    "Turn trending topics into viral scripts — in your voice, in Hinglish. The only AI content tool built for the Indian creator economy with voice profiling, trend intelligence, and direct publishing.",
  keywords: [
    "AI content creator",
    "Indian creator tool",
    "Hinglish AI writer",
    "Instagram Reels script",
    "YouTube Shorts script",
    "content creation AI",
    "voice profiling",
    "trending topics",
    "creator economy India",
  ],
  openGraph: {
    title: "CreatorAI Pro — AI Content Engine for Indian Creators",
    description:
      "Turn trending topics into viral scripts — in your voice, in Hinglish.",
    type: "website",
    locale: "en_IN",
    siteName: "CreatorAI Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreatorAI Pro — AI Content Engine for Indian Creators",
    description:
      "Turn trending topics into viral scripts — in your voice, in Hinglish.",
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/react";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
        <body className="min-h-full flex flex-col noise-overlay">
          <ErrorBoundary>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
