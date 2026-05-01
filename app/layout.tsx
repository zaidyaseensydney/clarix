import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/clarix/site-header";
import { SiteFooter } from "@/components/clarix/site-footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clarix — AI Tutoring for Australian Students",
  description:
    "A modern AI tutoring experience aligned to the Australian curriculum, built for students from Year 1 to Year 12 and trusted by parents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <SiteFooter />
        <Toaster richColors position="top-right" duration={3000} />
      </body>
    </html>
  );
}
