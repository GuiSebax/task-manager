"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/lib/categories";
import type { Category } from "@/lib/types";
import Navbar from "@/components/Navbar";
import { Plus, Trash2, Tag } from "lucide-react";

const inputClass =
  "bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted)]";
const labelClass = "text-sm font-medium text-[var(--muted)]";

export default function CategoriesPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn]);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSignedIn) fetchCategories();
  }, [isSignedIn]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      await createCategory({ name, color });
      setName("");
      setColor("#6366f1");
      fetchCategories();
    } catch (err) {
      setError("Failed to create category. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--muted)] text-sm">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Categories
          </h2>
          <p className="text-[var(--muted)] text-sm mt-1">
            Organize your tasks with categories
          </p>
        </div>

        {/* Create category form */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
            New Category
          </h3>

          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Work, Personal, Study"
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[var(--card-border)] cursor-pointer bg-transparent"
                />
                <span className="text-sm text-[var(--muted)] font-mono">
                  {color}
                </span>
                <div
                  className="w-6 h-6 rounded-full border border-[var(--card-border)]"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              {creating ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* Categories list */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Tag size={14} className="text-[var(--muted)]" />
            Your Categories
            <span className="ml-auto text-xs text-[var(--muted)] font-normal">
              {categories.length} total
            </span>
          </h3>

          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--muted)] text-sm">No categories yet!</p>
              <p className="text-[var(--muted)] text-xs mt-1">
                Create one above to get started
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="group flex items-center justify-between p-3 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {cat.name}
                    </span>
                    <span className="text-xs font-mono text-[var(--muted)]">
                      {cat.color}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-[var(--muted)] hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
