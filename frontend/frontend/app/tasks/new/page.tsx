"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createTask } from "@/lib/tasks";
import { getCategories } from "@/lib/categories";
import type { Category } from "@/lib/types";
import Navbar from "@/components/Navbar";
import { Plus } from "lucide-react";

const inputClass =
  "bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted)]";
const labelClass = "text-sm font-medium text-[var(--muted)]";

export default function NewTaskPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (isSignedIn) getCategories().then(setCategories);
  }, [isSignedIn]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createTask({
        title,
        description: description || undefined,
        priority,
        dueDate: dueDate || undefined,
        categoryId: categoryId || undefined,
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            New Task
          </h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Fill in the details below to create a task
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description (optional)"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className={inputClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClass}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--card-border)]" />

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 border border-[var(--card-border)] text-[var(--muted)] px-4 py-2 rounded-lg text-sm font-medium hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
