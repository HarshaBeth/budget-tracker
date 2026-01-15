"use client";

import { SidebarProvider, useSidebar } from "@/app/_context/SidebarContext";
import SideBar from "../_components/SideBar";

function LayoutInner({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const { isOpen } = useSidebar();

  return (
    <>
      <SideBar user_name={userName} />
      <main
        className={`relative transition-all duration-300 flex-1 min-h-screen ${
          isOpen ? "ml-60" : "ml-20"
        }`}
      >
        {children}
      </main>
    </>
  );
}

export default function LayoutClient({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  return (
    <SidebarProvider>
      <LayoutInner userName={userName}>{children}</LayoutInner>
    </SidebarProvider>
  );
}
