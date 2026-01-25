"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import ResearchPapersModal from "./ResearchPapersModal";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Live monitoring overview • NDVI • Encroachment • Alerts
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <BookOpen className="mr-2 h-4 w-4" />
              Research Papers
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#071225] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Research Papers</DialogTitle>
            </DialogHeader>
            <ResearchPapersModal open={open} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}