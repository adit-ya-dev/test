import type { JobHistoryItem, JobStatus } from "@/types/jobs";

export type DataLogsResponse = {
  total: number;
  logs: JobHistoryItem[];
};

export type DataLogsFilters = {
  query: string;
  status: "ALL" | JobStatus;
  sort: "NEWEST" | "OLDEST";
};
