"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import type { PlayerStats } from "@/types";

interface PlayerStatsChartProps {
  stats: PlayerStats[];
}

export function PlayerStatsChart({ stats }: PlayerStatsChartProps) {
  const lineData = stats.map((s, i) => ({
    match: `M${i + 1}`,
    score: s.score,
    kills: s.kills,
  }));

  const totalKills = stats.reduce((sum, s) => sum + s.kills, 0);
  const totalDeaths = stats.reduce((sum, s) => sum + s.deaths, 0);
  const totalAssists = stats.reduce((sum, s) => sum + s.assists, 0);
  const totalScore = stats.reduce((sum, s) => sum + s.score, 0);
  const avgKills = stats.length ? totalKills / stats.length : 0;
  const avgDeaths = stats.length ? totalDeaths / stats.length : 0;
  const avgAssists = stats.length ? totalAssists / stats.length : 0;
  const avgScore = stats.length ? totalScore / stats.length : 0;

  const radarData = [
    { stat: "Kills", value: avgKills, max: 25 },
    { stat: "Deaths", value: avgDeaths, max: 15 },
    { stat: "Assists", value: avgAssists, max: 20 },
    { stat: "Score", value: avgScore / 2, max: 20 },
  ];

  if (stats.length === 0) {
    return (
      <Card hoverEffect={false}>
        <CardContent>
          <p className="text-sm text-text-muted text-center py-8">No stats data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Score Over Time */}
      <Card hoverEffect={false}>
        <CardHeader>
          <h3 className="font-heading font-semibold text-text">Score Over Time</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
              <XAxis dataKey="match" stroke="#7A8BA0" fontSize={12} />
              <YAxis stroke="#7A8BA0" fontSize={12} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#0F1523",
                  border: "1px solid #1E2D4A",
                  borderRadius: "8px",
                  color: "#F0E6D3",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#C89B3C"
                strokeWidth={2}
                dot={{ fill: "#C89B3C", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="kills"
                stroke="#0BC4FF"
                strokeWidth={2}
                dot={{ fill: "#0BC4FF", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card hoverEffect={false}>
        <CardHeader>
          <h3 className="font-heading font-semibold text-text">Performance Radar</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1E2D4A" />
              <PolarAngleAxis dataKey="stat" stroke="#7A8BA0" fontSize={12} />
              <PolarRadiusAxis stroke="#1E2D4A" />
              <Radar
                name="Stats"
                dataKey="value"
                stroke="#C89B3C"
                fill="#C89B3C"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
