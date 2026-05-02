"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { SkeletonCard, SkeletonStats } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/animations/FadeIn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings, Building2, Zap } from "lucide-react";
import Link from "next/link";
import type { DashboardStats } from "@/types";

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (session && !isAdmin) {
      router.push("/dashboard");
    }
  }, [session, isAdmin, router]);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/stats");
      if (res.ok) setStats(await res.json());
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (!isAdmin) return null;

  const adminCards = [
    { title: "Companies", description: "Manage game companies", icon: <Building2 size={22} />, href: "/admin/companies" },
    { title: "Match Simulation", description: "Simulate match results", icon: <Zap size={22} />, href: "/admin/simulate" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Panel" description="System administration">
        <Settings size={20} className="text-text-muted" />
      </PageHeader>

      {loading ? <SkeletonStats /> : stats ? <StatsGrid stats={stats} /> : null}

      <FadeIn delay={0.2}>
        <h3 className="text-lg font-heading font-semibold text-text mb-4">Admin Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adminCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card glowColor="gold" className="group cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-text group-hover:text-primary transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-sm text-text-muted mt-0.5">{card.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
