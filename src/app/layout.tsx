import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./_components/SideBar";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, useSidebar } from "./_context/SidebarContext";
import ClientLayout from "./_context/ClientLayout";
import LayoutClient from "./_context/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Track your spendings easily and efficiently.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const session = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex">
        {session.data.user ? (
          <LayoutClient userName={session.data.user.user_metadata.full_name}>
            {children}
          </LayoutClient>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
