"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { reports, type ReportStatus } from "@/lib/mock-reports";

const STATUS_STYLES: Record<ReportStatus, { bg: string; text: string; label: string }> = {
  open: { bg: "#FFFBEB", text: "#B7791F", label: "Open" },
  resolved: { bg: "#F0FDF4", text: "#16A34A", label: "Resolved" },
  dismissed: { bg: "#F3F4F6", text: "#6B7280", label: "Dismissed" },
};

const FILTERS: { label: string; value: ReportStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Resolved", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
];

export default function ReportsQueuePage() {
  const [filter, setFilter] = useState<ReportStatus | "all">("open");

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);
  const openCount = reports.filter((r) => r.status === "open").length;

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Reports Queue</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        {openCount} open report{openCount === 1 ? "" : "s"} awaiting review across posts, users, channels, and postings.
      </p>

      <div className="flex items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === f.value
                ? "bg-kb-primary text-white"
                : "bg-kb-bg-card border border-kb-border text-kb-text-muted hover:text-kb-text-body"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_20px] gap-4 px-5 py-3 border-b border-kb-border text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder">
          <span>Target</span>
          <span>Type</span>
          <span>Reason</span>
          <span>Reported by</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.map((report) => {
          const style = STATUS_STYLES[report.status];
          return (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_20px] gap-4 px-5 py-4 items-center border-b border-kb-border last:border-b-0 hover:bg-kb-bg-alt transition-colors"
            >
              <span className="text-sm font-semibold text-kb-text-body min-w-0 truncate" title={report.targetLabel}>
                {report.targetLabel}
              </span>
              <span className="text-sm text-kb-text-muted capitalize truncate">{report.targetType}</span>
              <span className="text-sm text-kb-text-muted truncate">{report.reason}</span>
              <span className="text-sm text-kb-text-muted truncate">{report.reporterName}</span>
              <span
                className="inline-flex w-fit text-xs font-semibold rounded-full px-2.5 py-1"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {style.label}
              </span>
              <ChevronRight size={18} className="text-kb-text-placeholder justify-self-end" />
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-kb-text-muted">No reports in this category.</div>
        )}
      </div>
    </div>
  );
}
