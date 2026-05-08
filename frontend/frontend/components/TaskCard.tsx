import type { Task } from "@/lib/types";
import { updateTask, deleteTask } from "@/lib/tasks";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors text-xs shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 text-xs leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        {task.category && (
          <span
            className="text-xs px-2 py-1 rounded-full font-medium text-white"
            style={{ backgroundColor: task.category.color }}
          >
            {task.category.name}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Status selector */}
      <select
        value={task.status}
        onChange={(e) => handleStatusChange(e.target.value as any)}
        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColors[task.status]}`}
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
