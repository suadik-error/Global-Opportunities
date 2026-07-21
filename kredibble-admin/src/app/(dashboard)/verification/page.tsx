import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { pendingCompanies, type DocStatus } from "@/lib/mock-data";

const STATUS_STYLES: Record<DocStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "#FFFBEB", text: "#B7791F", label: "Pending" },
  approved: { bg: "#F0FDF4", text: "#16A34A", label: "Approved" },
  rejected: { bg: "#FEF2F2", text: "#ED4C5C", label: "Rejected" },
};

export default function VerificationQueuePage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Verification Queue</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        Review the documents companies submitted at signup and approve or reject their Hirer verification.
      </p>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_20px] gap-4 px-5 py-3 border-b border-kb-border text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder">
          <span>Company</span>
          <span>Industry</span>
          <span>Submitted</span>
          <span>Status</span>
          <span />
        </div>

        {pendingCompanies.map((company) => {
          const docsApproved = Object.values(company.docs).filter((d) => d.status === "approved").length;
          const style = STATUS_STYLES[company.overallStatus];

          return (
            <Link
              key={company.id}
              href={`/verification/${company.id}`}
              className="grid grid-cols-[2fr_1.2fr_1fr_1fr_20px] gap-4 px-5 py-4 items-center border-b border-kb-border last:border-b-0 hover:bg-kb-bg-alt transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-kb-text-body">{company.name}</p>
                <p className="text-xs text-kb-text-muted mt-0.5">{docsApproved}/4 documents approved</p>
              </div>
              <span className="text-sm text-kb-text-muted">{company.industry}</span>
              <span className="text-sm text-kb-text-muted">{company.submittedDate}</span>
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
      </div>
    </div>
  );
}
