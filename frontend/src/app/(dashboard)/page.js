// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react"; // keeping useState/useEffect if needed later
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useGetTasksQuery } from "@/api/taskApi";

export default function Dashboard() {
  const { data: tasksData = [], isLoading: tasksLoading } = useGetTasksQuery();

  const tasks = Array.isArray(tasksData)
    ? tasksData
    : tasksData?.tasks || tasksData?.data || [];

  // Stats Calculation

  const activeTasks = tasks.filter(
    (t) => t.status === "in-progress" || t.status === "todo",
  ).length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const recentTasks = tasks.slice(0, 4);

  if (tasksLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8" data-testid="dashboard-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Recent Tasks */}
      <Card className="border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest task updates</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tasks">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task._id || task.id}
                  className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          task.status === "done"
                            ? "bg-green-500/15 text-green-500 border-green-500/20"
                            : task.status === "in-progress"
                              ? "bg-blue-500/15 text-blue-500 border-blue-500/20"
                              : "bg-zinc-500/15 text-zinc-500 border-zinc-500/20"
                        }`}
                      >
                        {task.status?.replace("-", " ") || "todo"}
                      </Badge>
                      <Badge
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          task.priority === "high"
                            ? "bg-red-500/15 text-red-500 border-red-500/20"
                            : task.priority === "medium"
                              ? "bg-blue-500/15 text-blue-500 border-blue-500/20"
                              : "bg-zinc-500/15 text-zinc-500 border-zinc-500/20"
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                No tasks yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
