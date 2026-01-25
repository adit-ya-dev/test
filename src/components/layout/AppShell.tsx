"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Map,
  FileSearch,
  Database,
  Siren,
} from "lucide-react";

const navItems = [
  {
    name: { en: "Dashboard", hi: "डैशबोर्ड" },
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: { en: "Map Analysis", hi: "मानचित्र विश्लेषण" },
    href: "/analysis",
    icon: Map,
  },
  {
    name: { en: "Scan Result", hi: "स्कैन परिणाम" },
    href: "/scan-result",
    icon: FileSearch,
  },
  {
    name: { en: "Data Logs", hi: "डेटा लॉग्स" },
    href: "/data-logs",
    icon: Database,
  },
  {
    name: { en: "Alerts Centre", hi: "सतर्कता केंद्र" },
    href: "/alerts",
    icon: Siren,
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 1. STATE FOR ACCESSIBILITY
  const [fontSize, setFontSize] = useState(100); // Percentage
  const [lang, setLang] = useState<"en" | "hi">("en");

  // 2. APPLY FONT SIZE TO HTML ELEMENT
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const adjustFont = (type: "increase" | "decrease" | "reset") => {
    if (type === "increase" && fontSize < 120) setFontSize((prev) => prev + 5);
    if (type === "decrease" && fontSize > 85) setFontSize((prev) => prev - 5);
    if (type === "reset") setFontSize(100);
  };

  return (
    <div className="min-h-screen bg-[#050B16] text-white font-sans">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 h-[80px] bg-gradient-to-b from-[#0B1A33] to-[#061225] border-b border-white/10 flex items-center px-6">
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
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.4em] text-white">
            SENTINEL EYE
          </h1>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-1 items-center justify-end gap-4 text-sm">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            {/* Font Buttons */}
            <button
              onClick={() => adjustFont("decrease")}
              className="hover:text-blue-400 transition-colors px-1"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => adjustFont("reset")}
              className="hover:text-blue-400 transition-colors font-bold px-1"
              aria-label="Reset font size"
            >
              A
            </button>
            <button
              onClick={() => adjustFont("increase")}
              className="hover:text-blue-400 transition-colors px-1"
              aria-label="Increase font size"
            >
              A+
            </button>
            <span className="text-white/20 mx-1">|</span>
            {/* Language Buttons */}
            <button
              onClick={() => setLang("en")}
              className={`transition-colors ${
                lang === "en"
                  ? "text-blue-400 font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`transition-colors ${
                lang === "hi"
                  ? "text-blue-400 font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* FIXED SIDEBAR */}
      <aside className="fixed left-0 top-[80px] bottom-0 z-20 w-[260px] bg-[#071225] border-r border-white/10 flex flex-col">
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all
                  ${
                    active
                      ? "bg-blue-600/20 border-blue-500/40 text-white"
                      : "border-transparent text-white/70 hover:bg-white/5"
                  }`}
              >
                <Icon size={18} />
                <span className="text-sm font-semibold">{item.name[lang]}</span>
              </Link>
            );
          })}
        </nav>

        {/* System Health - pinned at bottom */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="bg-[#06101F] border border-white/10 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
              {lang === "en" ? "System Health" : "सिस्टम स्थिति"}
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">
                {lang === "en" ? "Uplink" : "अपलिंक"}
              </span>
              <span className="text-xs font-bold text-green-400">ONLINE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT - pushed right & below fixed elements */}
      <main className="ml-[260px] mt-[80px] min-h-[calc(100vh-80px)] p-6 bg-[#050B16] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
