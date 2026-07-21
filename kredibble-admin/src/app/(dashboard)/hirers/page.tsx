"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { hirerAccounts, type VerificationSummary } from "@/lib/mock-hirers";

const VERIFICATION_STYLES: Record<VerificationSummary, { bg: string; text: string; label: string }> = {
  verified: { bg: "#F0FDF4", text: "#16A34A", label: "Verified" },
  pending: { bg: "#FFFBEB", text: "#B7791F", label: "Pending" },
  rejected: { bg: "#FEF2F2", text: "#ED4C5C", label: "Rejected" },
};

export default function HirersDirectoryPage() {
  const [query, setQuery] = useState("");

  const filtered = hirerAccounts.filter((h) =>
    `${h.companyName} ${h.recruiterName} ${h.recruiterEmail} ${h.industry}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Hirers Directory</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        {hirerAccounts.length} hirer/company accounts registered on the platform.
      </p>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kb-text-placeholder" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company, recruiter, industry..."
          className="w-full h-10 rounded-lg border border-kb-border-input bg-kb-bg-card pl-9 pr-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
        />
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1.4fr_1fr_0.8fr_1fr_1fr_20px] gap-4 px-5 py-3 border-b border-kb-border text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder">
          <span>Company</span>
          <span>Recruiter</span>
          <span>Industry</span>
          <span>Postings</span>
          <span>Verification</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.map((hirer) => {
          const v = VERIFICATION_STYLES[hirer.verification];
          return (
            <Link
              key={hirer.id}
              href={`/hirers/${hirer.id}`}
              className="grid grid-cols-[1.6fr_1.4fr_1fr_0.8fr_1fr_1fr_20px] gap-4 px-5 py-4 items-center border-b border-kb-border last:border-b-0 hover:bg-kb-bg-alt transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-kb-text-body truncate">{hirer.companyName}</p>
                <p className="text-xs text-kb-text-muted mt-0.5 truncate" title={hirer.location}>
                  {hirer.location}
                </p>
              </div>
              <span className="text-sm text-kb-text-muted truncate">{hirer.recruiterName}</span>
              <span className="text-sm text-kb-text-muted truncate">{hirer.industry}</span>
              <span className="text-sm text-kb-text-muted truncate">{hirer.postingsCount}</span>
              <span
                className="inline-flex w-fit text-xs font-semibold rounded-full px-2.5 py-1"
                style={{ backgroundColor: v.bg, color: v.text }}
              >
                {v.label}
              </span>
              <span
                className="inline-flex w-fit text-xs font-semibold rounded-full px-2.5 py-1"
                style={
                  hirer.status === "active"
                    ? { backgroundColor: "#F0FDF4", color: "#16A34A" }
                    : { backgroundColor: "#FEF2F2", color: "#ED4C5C" }
                }
              >
                {hirer.status === "active" ? "Active" : "Suspended"}
              </span>
              <ChevronRight size={18} className="text-kb-text-placeholder justify-self-end" />
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-kb-text-muted">No hirers match your search.</div>
        )}
      </div>
    </div>
  );
}
