import type { Task } from "@/lib/types";
import { updateTask, deleteTask } from "@/lib/tasks";
import { Trash2, Calendar, Tag } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const priorityConfig = {
  low: { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Low" },
  medium: { color: "text-amber-400", bg: "bg-amber-400/10", label: "Medium" },
  high: { color: "text-red-400", bg: "bg-red-400/10", label: "High" },
};

const statusConfig = {
  todo: { color: "text-slate-400", bg: "bg-slate-400/10", label: "To Do" },
  in_progress: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    label: "In Progress",
  },
  done: { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Done" },
};

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  async function handleStatusChange(status: "todo" | "in_progress" | "done") {
    await updateTask(task.id, { status });
    onUpdate();
  }

  async function handleDelete() {
    await deleteTask(task.id);
    onUpdate();
  }

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className="group relative bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 flex flex-col gap-4 hover:border-[var(--primary)] transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-[var(--muted)] hover:text-red-400 hover:bg-red-400/10"
      >
        <Trash2 size={14} />
      </button>

      {/* Title */}
      <div className="pr-8">
        <h3
          className={`font-semibold text-sm leading-snug ${task.status === "done" ? "line-through text-[var(--muted)]" : "text-[var(--foreground)]"}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-[var(--muted)] text-xs mt-1.5 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.bg} ${priority.color}`}
        >
          {priority.label}
        </span>
        {task.category && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium text-white flex items-center gap-1"
            style={{
              backgroundColor: task.category.color + "33",
              color: task.category.color,
            }}
          >
            <Tag size={10} />
            {task.category.name}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-400/10 text-purple-400 flex items-center gap-1">
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--card-border)]" />

      {/* Status selector */}
      <select
        value={task.status}
        onChange={(e) => handleStatusChange(e.target.value as any)}
        className={`text-xs px-2 py-1 rounded-md font-medium border-0 cursor-pointer w-fit ${status.bg} ${status.color}`}
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
