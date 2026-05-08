"use client";

import { useRouter, usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { LayoutDashboard, Tag, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Categories", path: "/categories", icon: Tag },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card)] backdrop-blur-sm">
      <div className=" mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <span
            onClick={() => router.push("/dashboard")}
            className="text-base font-bold text-[var(--primary)] cursor-pointer tracking-tight"
          >
            TaskManager
          </span>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${
                    pathname === path
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)]"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end w-full gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)] transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}
