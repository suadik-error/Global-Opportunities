"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Briefcase, GraduationCap, CalendarDays, HandCoins } from "lucide-react";
import { postedOpportunities, type ModerationStatus, type OpportunityType } from "@/lib/mock-opportunities";

const STATUS_STYLES: Record<ModerationStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "#FFFBEB", text: "#B7791F", label: "Pending" },
  approved: { bg: "#F0FDF4", text: "#16A34A", label: "Approved" },
  rejected: { bg: "#FEF2F2", text: "#ED4C5C", label: "Rejected" },
};

const TYPE_META: Record<OpportunityType, { label: string; icon: typeof Briefcase; color: string }> = {
  jobs: { label: "Job", icon: Briefcase, color: "#6671E4" },
  internships: { label: "Internship", icon: GraduationCap, color: "#F59E0B" },
  events: { label: "Event", icon: CalendarDays, color: "#10B981" },
  grants: { label: "Grant", icon: HandCoins, color: "#EF4444" },
};

const FILTERS: { label: string; value: OpportunityType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Jobs", value: "jobs" },
  { label: "Internships", value: "internships" },
  { label: "Events", value: "events" },
  { label: "Grants", value: "grants" },
];

export default function OpportunitiesQueuePage() {
  const [filter, setFilter] = useState<OpportunityType | "all">("all");

  const filtered =
    filter === "all" ? postedOpportunities : postedOpportunities.filter((o) => o.type === filter);

  const pendingCount = postedOpportunities.filter((o) => o.moderationStatus === "pending").length;

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Opportunities Queue</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        Review Jobs, Internships, Events, and Grants posted by hirers. {pendingCount} awaiting review.
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
        <div className="grid grid-cols-[2fr_1.3fr_1fr_1fr_1fr_20px] gap-4 px-5 py-3 border-b border-kb-border text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder">
          <span>Title</span>
          <span>Company</span>
          <span>Type</span>
          <span>Posted</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.map((opp) => {
          const type = TYPE_META[opp.type];
          const status = STATUS_STYLES[opp.moderationStatus];
          const Icon = type.icon;

          return (
            <Link
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="grid grid-cols-[2fr_1.3fr_1fr_1fr_1fr_20px] gap-4 px-5 py-4 items-center border-b border-kb-border last:border-b-0 hover:bg-kb-bg-alt transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-kb-text-body truncate" title={opp.title}>
                  {opp.title}
                </p>
                <p className="text-xs text-kb-text-muted mt-0.5">{opp.applicantsCount} applied</p>
              </div>
              <span className="text-sm text-kb-text-muted truncate">{opp.company}</span>
              <span className="flex items-center gap-1.5 text-sm text-kb-text-muted w-fit min-w-0">
                <Icon size={14} color={type.color} className="shrink-0" />
                <span className="truncate">{type.label}</span>
              </span>
              <span className="text-sm text-kb-text-muted truncate">{opp.date}</span>
              <span
                className="inline-flex w-fit text-xs font-semibold rounded-full px-2.5 py-1"
                style={{ backgroundColor: status.bg, color: status.text }}
              >
                {status.label}
              </span>
              <ChevronRight size={18} className="text-kb-text-placeholder justify-self-end" />
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-kb-text-muted">
            No opportunities in this category.
          </div>
        )}
      </div>
    </div>
  );
}
