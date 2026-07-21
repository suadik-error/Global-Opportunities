"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Check, X } from "lucide-react";
import { grantRecords, type GrantRecord, type GrantApplication } from "@/lib/mock-grant-ops";

export default function GrantDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = grantRecords.find((g) => g.id === params.id);
  const [grant, setGrant] = useState<GrantRecord | undefined>(original);

  if (!grant) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Grant not found.</p>
        <Link href="/grants" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Grants
        </Link>
      </div>
    );
  }

  const setAppStatus = (appId: string, status: GrantApplication["status"]) => {
    setGrant((prev) => {
      if (!prev) return prev;
      const applications = prev.applications.map((a) => (a.id === appId ? { ...a, status } : a));
      const allocated = applications
        .filter((a) => a.status === "approved")
        .reduce((sum, a) => sum + a.requestedAmount, 0);
      return { ...prev, applications, allocated };
    });
  };

  const pct = Math.round((grant.allocated / grant.fundingPool) * 100);
  const remaining = grant.fundingPool - grant.allocated;

  return (
    <div>
      <button
        onClick={() => router.push("/grants")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Grants
      </button>

      <h1 className="text-xl font-bold text-kb-text-body">{grant.title}</h1>
      <p className="text-sm text-kb-text-muted mt-1 mb-6">
        {grant.hirer} · {grant.sector}
      </p>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-3">
          Funding Pool
        </p>
        <div className="h-3 rounded-full bg-kb-bg-alt overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-kb-primary transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-sm text-kb-text-muted">
          ${grant.allocated.toLocaleString()} allocated of ${grant.fundingPool.toLocaleString()} ({pct}%)
          · ${remaining.toLocaleString()} remaining
        </p>
      </div>

      <h2 className="text-sm font-bold text-kb-text-body mb-3">Applications</h2>
      <div className="flex flex-col gap-3">
        {grant.applications.map((app) => (
          <div
            key={app.id}
            className="flex items-center gap-4 bg-kb-bg-card border border-kb-border rounded-2xl p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-kb-text-body">{app.applicantName}</p>
              <p className="text-xs text-kb-text-muted mt-0.5">
                Requested ${app.requestedAmount.toLocaleString()}
              </p>
            </div>
            <span
              className="text-xs font-semibold rounded-full px-2.5 py-1 shrink-0"
              style={
                app.status === "approved"
                  ? { backgroundColor: "#F0FDF4", color: "#16A34A" }
                  : app.status === "rejected"
                    ? { backgroundColor: "#FEF2F2", color: "#ED4C5C" }
                    : { backgroundColor: "#FFFBEB", color: "#B7791F" }
              }
            >
              {app.status === "approved" ? "Approved" : app.status === "rejected" ? "Rejected" : "Pending"}
            </span>
            {app.status === "pending" && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setAppStatus(app.id, "approved")}
                  className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors"
                  title="Approve"
                  disabled={app.requestedAmount > remaining}
                >
                  <Check size={15} color="#16A34A" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setAppStatus(app.id, "rejected")}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                  title="Reject"
                >
                  <X size={15} color="#ED4C5C" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
