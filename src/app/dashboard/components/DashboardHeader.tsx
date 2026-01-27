"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import ResearchPapersModal from "./ResearchPapersModal";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-6 pb-0">
      <div>
        <h1 className="text-2xl font-black tracking-wide text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live monitoring overview • NDVI • Encroachment • Alerts
        </p>
      </div>

      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-border bg-card text-foreground hover:bg-muted"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Research Papers
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle>Research Papers</DialogTitle>
            </DialogHeader>
            <ResearchPapersModal open={open} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
