"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Briefcase, GraduationCap, CalendarDays, HandCoins, Check, X } from "lucide-react";
import {
  postedOpportunities,
  type ModerationStatus,
  type OpportunityType,
  type PostedOpportunity,
} from "@/lib/mock-opportunities";

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

export default function OpportunityReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = postedOpportunities.find((o) => o.id === params.id);

  const [opp, setOpp] = useState<PostedOpportunity | undefined>(original);

  if (!opp) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Opportunity not found.</p>
        <Link href="/opportunities" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Opportunities Queue
        </Link>
      </div>
    );
  }

  const setStatus = (moderationStatus: ModerationStatus) => {
    setOpp((prev) => (prev ? { ...prev, moderationStatus } : prev));
  };

  const type = TYPE_META[opp.type];
  const status = STATUS_STYLES[opp.moderationStatus];
  const Icon = type.icon;

  return (
    <div>
      <button
        onClick={() => router.push("/opportunities")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Opportunities Queue
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1"
              style={{ backgroundColor: `${type.color}1A`, color: type.color }}
            >
              <Icon size={13} />
              {type.label}
            </span>
          </div>
          <h1 className="text-xl font-bold text-kb-text-body">{opp.title}</h1>
          <p className="text-sm text-kb-text-muted mt-1">
            {opp.company} · {opp.location}
          </p>
        </div>
        <span
          className="text-xs font-semibold rounded-full px-3 py-1.5"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          {status.label}
        </span>
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-3">
          Description
        </p>
        <p className="text-sm text-kb-text-body leading-relaxed">{opp.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoCard title="Posting Details">
          <InfoRow label="Posted" value={opp.date} />
          <InfoRow label="Applicants" value={String(opp.applicantsCount)} />
          {opp.workType && <InfoRow label="Work Type" value={opp.workType} />}
          {opp.salary && <InfoRow label="Salary" value={opp.salary} />}
        </InfoCard>

        {(opp.eventDateTime || opp.eventCategory || opp.grantBudgetRange || opp.grantSector) && (
          <InfoCard title={opp.type === "events" ? "Event Details" : "Grant Details"}>
            {opp.eventDateTime && <InfoRow label="Date & Time" value={opp.eventDateTime} />}
            {opp.eventCategory && <InfoRow label="Category" value={opp.eventCategory} />}
            {opp.grantBudgetRange && <InfoRow label="Budget" value={opp.grantBudgetRange} />}
            {opp.grantSector && <InfoRow label="Sector" value={opp.grantSector} />}
          </InfoCard>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setStatus("approved")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-sm font-semibold text-green-700 transition-colors"
        >
          <Check size={16} strokeWidth={2.5} />
          Approve
        </button>
        <button
          onClick={() => setStatus("rejected")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-sm font-semibold text-red-600 transition-colors"
        >
          <X size={16} strokeWidth={2.5} />
          Reject
        </button>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-3">{title}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
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
