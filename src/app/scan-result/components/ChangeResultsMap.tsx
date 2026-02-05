"use client";

import dynamic from "next/dynamic";
import type { JobResultsResponse } from "@/types/jobs";

const ChangeResultsMapClient = dynamic(
  () => import("./ChangeResultsMapClient"),
  { ssr: false },
);

export default function ChangeResultsMap({
  results,
}: {
  results: JobResultsResponse;
}) {
  return <ChangeResultsMapClient results={results} />;
}
