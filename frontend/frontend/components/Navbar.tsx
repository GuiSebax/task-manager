"use client";

import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-lg font-bold text-indigo-600 cursor-pointer"
        >
          TaskManager
        </h1>
        <nav className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/categories")}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Categories
          </button>
        </nav>
      </div>
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  );
}
