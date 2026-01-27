"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Map,
  FileSearch,
  Database,
  Siren,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Map Analysis", href: "/analysis", icon: Map },
  { name: "Scan Result", href: "/scan-result", icon: FileSearch },
  { name: "Data Logs", href: "/data-logs", icon: Database },
  { name: "Alerts Centre", href: "/alerts", icon: Siren },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [fontSize, setFontSize] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const adjustFont = (type: "increase" | "decrease" | "reset") => {
    if (type === "increase" && fontSize < 120) setFontSize((p) => p + 5);
    if (type === "decrease" && fontSize > 85) setFontSize((p) => p - 5);
    if (type === "reset") setFontSize(100);
  };

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 h-[80px] flex items-center px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex-1 hidden md:block" />
        <div className="flex flex-1 items-center justify-center gap-6">
          <div className="relative w-14 h-14">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.35em] text-primary">
            SENTINEL EYE
          </h1>
        </div>
        {/* CONTROLS */}
        <div className="flex flex-1 items-center justify-end gap-4 text-sm">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-muted/40">
            <button
              onClick={() => adjustFont("decrease")}
              className="px-2 py-1 rounded-md transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => adjustFont("reset")}
              className="px-2 py-1 rounded-md font-semibold transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Reset font size"
            >
              A
            </button>
            <button
              onClick={() => adjustFont("increase")}
              className="px-2 py-1 rounded-md transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Increase font size"
            >
              A+
            </button>
            <span className="mx-1 text-muted-foreground">|</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-[80px] bottom-0 z-20 flex flex-col border-r bg-card transition-all duration-300 ease-in-out ${
          isExpanded ? "w-[260px]" : "w-[72px]"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            // Make Dashboard active also on root path "/"
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              (item.href === "/dashboard" && pathname === "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/25",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                ].join(" ")}
              >
                {/* Active indicator bar */}
                <span
                  className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full transition-all",
                    isActive
                      ? "bg-primary-foreground opacity-100"
                      : "bg-primary/40 opacity-0 group-hover:opacity-100",
                  ].join(" ")}
                />

                {/* Icon - always visible */}
                <Icon
                  size={20}
                  className={[
                    "flex-shrink-0 transition-transform duration-200",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground group-hover:scale-110",
                  ].join(" ")}
                />

                {/* Text - visible when expanded */}
                <span
                  className={[
                    "transition-all duration-300 whitespace-nowrap",
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 w-0 overflow-hidden",
                  ].join(" ")}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* USER FOOTER */}
        <div className="mt-auto p-4 border-t bg-muted/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={[
                  "w-full justify-start gap-2 h-12 rounded-xl transition-all duration-300",
                  !isExpanded && "px-2",
                ].join(" ")}
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm flex-shrink-0">
                  <Image
                    src="/avatar.png"
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className={[
                    "flex-1 text-left leading-tight transition-all duration-300",
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 w-0 overflow-hidden",
                  ].join(" ")}
                >
                  <p className="text-sm font-semibold">Aditya Pamar</p>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
                <ChevronDown
                  className={[
                    "w-4 h-4 text-muted-foreground transition-all duration-300",
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 w-0 overflow-hidden",
                  ].join(" ")}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="w-4 h-4 mr-2" />
                Security
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`mt-[80px] min-h-[calc(100vh-80px)] p-6 bg-background transition-all duration-300 ${
          isExpanded ? "ml-[260px]" : "ml-[72px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
