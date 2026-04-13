import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { clearStaleSpendings } from "@/lib/spendings";

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
  description: "Track your spending easily and efficiently.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const session = await supabase.auth.getUser();

  if (session.data.user) {
    const { error } = await clearStaleSpendings(supabase, session.data.user.id);

    if (error) {
      console.error("Error clearing stale spendings:", error);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
        suppressHydrationWarning
      >
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
