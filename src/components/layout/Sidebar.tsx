"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Swords,
  Trophy,
  Crown,
  Shield,
  Settings,
  Building2,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useSidebar } from "./SidebarContext";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Gamepad2,
  Swords,
  Trophy,
  Crown,
  Shield,
  Settings,
  Building2,
  Zap,
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Players", href: "/players", icon: "Users" },
  { label: "Games", href: "/games", icon: "Gamepad2" },
  { label: "Matches", href: "/matches", icon: "Swords" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Tournaments", href: "/tournaments", icon: "Crown" },
  { label: "Teams", href: "/teams", icon: "Shield" },
];

const adminItems = [
  { label: "Admin", href: "/admin", icon: "Settings" },
  { label: "Companies", href: "/admin/companies", icon: "Building2" },
  { label: "Simulate", href: "/admin/simulate", icon: "Zap" },
];

interface SidebarProps {
  userRole?: string;
  username?: string;
}

export function Sidebar({ userRole = "PLAYER", username = "Player" }: SidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-surface border-r border-border/30 flex flex-col transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border/30">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center flex-shrink-0">
            <Swords size={18} className="text-background" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-heading font-bold text-primary text-lg tracking-wide whitespace-nowrap"
            >
              GMS
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        <div className={cn("mb-4", !collapsed && "px-2")}>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted/50 mb-2">
              Main Menu
            </p>
          )}
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-text-muted hover:text-text hover:bg-surface-2/50"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {Icon && <Icon size={18} />}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {userRole === "ADMIN" && (
          <div className={cn(!collapsed && "px-2")}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted/50 mb-2 mt-4">
                Admin
              </p>
            )}
            {adminItems.map((item) => {
              const Icon = iconMap[item.icon];
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-text-muted hover:text-text hover:bg-surface-2/50"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {Icon && <Icon size={18} />}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/30 p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar fallback={username} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{username}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">
                {userRole}
              </p>
            </div>
          )}
          {!collapsed && (
            <button className="p-1.5 rounded-lg text-text-muted hover:text-accent-2 hover:bg-surface-2 transition-colors">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-2 border border-border/50 flex items-center justify-center text-text-muted hover:text-text transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
