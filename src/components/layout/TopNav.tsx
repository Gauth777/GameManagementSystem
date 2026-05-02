"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function TopNav() {
  return (
    <header className="h-16 sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border/30">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search players, games, matches..."
            icon={<Search size={16} />}
            className="bg-surface-2/50"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-2" />
          </button>
          <div className="h-8 w-px bg-border/30" />
          <div className="text-right">
            <p className="text-xs text-text-muted uppercase tracking-wider font-heading">
              Game Management System
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
