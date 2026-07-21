"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, XCircle, Hash } from "lucide-react";
import { reports, type Report, type ReportStatus } from "@/lib/mock-reports";

const STATUS_STYLES: Record<ReportStatus, { bg: string; text: string; label: string }> = {
  open: { bg: "#FFFBEB", text: "#B7791F", label: "Open" },
  resolved: { bg: "#F0FDF4", text: "#16A34A", label: "Resolved" },
  dismissed: { bg: "#F3F4F6", text: "#6B7280", label: "Dismissed" },
};

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = reports.find((r) => r.id === params.id);
  const [report, setReport] = useState<Report | undefined>(original);

  if (!report) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Report not found.</p>
        <Link href="/reports" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Reports Queue
        </Link>
      </div>
    );
  }

  const setStatus = (status: ReportStatus) => {
    setReport((prev) => (prev ? { ...prev, status } : prev));
  };

  const style = STATUS_STYLES[report.status];

  return (
    <div>
      <button
        onClick={() => router.push("/reports")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Reports Queue
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-1">
            {report.targetType}
          </p>
          <h1 className="text-xl font-bold text-kb-text-body">{report.targetLabel}</h1>
        </div>
        <span
          className="text-xs font-semibold rounded-full px-3 py-1.5"
          style={{ backgroundColor: style.bg, color: style.text }}
        >
          {style.label}
        </span>
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-3">
          Report Details
        </p>
        <div className="flex flex-col gap-2.5 mb-4">
          <InfoRow label="Reason" value={report.reason} />
          <InfoRow label="Reported by" value={report.reporterName} />
          <InfoRow label="Date" value={report.date} />
        </div>
        <p className="text-sm text-kb-text-body leading-relaxed">{report.details}</p>
      </div>

      {report.linkedChannelId && (
        <Link
          href={`/community/${report.linkedChannelId}`}
          className="flex items-center gap-2 text-sm font-semibold text-kb-primary mb-6"
        >
          <Hash size={16} />
          View the channel this report is about
        </Link>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setStatus("resolved")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-sm font-semibold text-green-700 transition-colors"
        >
          <CheckCircle2 size={16} strokeWidth={2.5} />
          Mark resolved
        </button>
        <button
          onClick={() => setStatus("dismissed")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition-colors"
        >
          <XCircle size={16} strokeWidth={2.5} />
          Dismiss
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-kb-text-muted">{label}</span>
      <span className="text-sm text-kb-text-body font-medium text-right">{value}</span>
    </div>
  );
}
