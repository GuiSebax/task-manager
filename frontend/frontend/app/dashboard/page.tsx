"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getTasks } from "@/lib/tasks";
import { getCategories } from "@/lib/categories";
import type { Task, Category } from "@/lib/types";
import TaskCard from "@/components/TaskCard";
import Navbar from "@/components/Navbar";
import { Plus, ListTodo } from "lucide-react";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn]);

  async function fetchData() {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        getTasks(),
        getCategories(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSignedIn) fetchData();
  }, [isSignedIn]);

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const priorityMatch =
      filterPriority === "all" || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--muted)] text-sm">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Dashboard
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Manage and track your tasks
            </p>
          </div>
          <button
            onClick={() => router.push("/tasks/new")}
            className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "text-[var(--foreground)]",
            },
            { label: "To Do", value: stats.todo, color: "text-slate-400" },
            {
              label: "In Progress",
              value: stats.inProgress,
              color: "text-blue-400",
            },
            { label: "Done", value: stats.done, color: "text-emerald-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4"
            >
              <p className="text-[var(--muted)] text-xs font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-[var(--card-border)] rounded-lg px-3 py-2 bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-sm border border-[var(--card-border)] rounded-lg px-3 py-2 bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Tasks grid */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="p-4 rounded-full bg-[var(--card)] border border-[var(--card-border)]">
              <ListTodo size={32} className="text-[var(--muted)]" />
            </div>
            <div className="text-center">
              <p className="text-[var(--foreground)] font-medium">
                No tasks yet
              </p>
              <p className="text-[var(--muted)] text-sm mt-1">
                Click "New Task" to get started
              </p>
            </div>
            <button
              onClick={() => router.push("/tasks/new")}
              className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={fetchData} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
