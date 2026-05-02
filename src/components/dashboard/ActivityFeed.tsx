"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/utils";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: number;
  text: string;
  time: string;
  type: "match" | "tournament" | "player" | "system";
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const typeColors = {
  match: "bg-accent/20 text-accent",
  tournament: "bg-primary/20 text-primary",
  player: "bg-success/20 text-success",
  system: "bg-text-muted/20 text-text-muted",
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card hoverEffect={false}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-accent" />
          <h3 className="font-heading font-semibold text-text">Activity Feed</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 p-0">
        {activities.length === 0 ? (
          <p className="text-sm text-text-muted px-5 py-4">No recent activity</p>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 px-5 py-3 border-b border-border/10 last:border-0"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[item.type].split(" ")[0]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text">{item.text}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {formatRelativeTime(item.time)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
