"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { useSession, SessionProvider } from "next-auth/react";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { collapsed } = useSidebar();
  
  const userRole = session?.user?.role || "PLAYER";
  const username = session?.user?.username || session?.user?.name || "Player";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} username={username} />
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? "70px" : "250px" }}
      >
        <TopNav />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </SessionProvider>
  );
}
