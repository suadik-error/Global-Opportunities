"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileText, Check, X } from "lucide-react";
import { pendingCompanies, type DocStatus, type PendingCompany } from "@/lib/mock-data";

const DOC_KEYS = ["businessReg", "orgId", "companyLogo", "proofOfOrg"] as const;

const STATUS_STYLES: Record<DocStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "#FFFBEB", text: "#B7791F", label: "Pending" },
  approved: { bg: "#F0FDF4", text: "#16A34A", label: "Approved" },
  rejected: { bg: "#FEF2F2", text: "#ED4C5C", label: "Rejected" },
};

export default function VerificationReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = pendingCompanies.find((c) => c.id === params.id);

  const [company, setCompany] = useState<PendingCompany | undefined>(original);

  if (!company) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Company not found.</p>
        <Link href="/verification" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Verification Queue
        </Link>
      </div>
    );
  }

  const setDocStatus = (key: (typeof DOC_KEYS)[number], status: DocStatus) => {
    setCompany((prev) => {
      if (!prev) return prev;
      const nextDocs = { ...prev.docs, [key]: { ...prev.docs[key], status } };
      const allApproved = Object.values(nextDocs).every((d) => d.status === "approved");
      const anyRejected = Object.values(nextDocs).some((d) => d.status === "rejected");
      const overallStatus: DocStatus = allApproved ? "approved" : anyRejected ? "rejected" : "pending";
      return { ...prev, docs: nextDocs, overallStatus };
    });
  };

  const overallStyle = STATUS_STYLES[company.overallStatus];

  return (
    <div>
      <button
        onClick={() => router.push("/verification")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Verification Queue
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-kb-text-body">{company.name}</h1>
          <p className="text-sm text-kb-text-muted mt-1">
            {company.industry} · {company.companySize} · {company.location}
          </p>
        </div>
        <span
          className="text-xs font-semibold rounded-full px-3 py-1.5"
          style={{ backgroundColor: overallStyle.bg, color: overallStyle.text }}
        >
          {overallStyle.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <InfoCard title="Company">
          <InfoRow label="Website" value={company.website} />
          <InfoRow label="Company Email" value={company.companyEmail} />
          <InfoRow label="Submitted" value={company.submittedDate} />
        </InfoCard>
        <InfoCard title="Recruiter">
          <InfoRow label="Name" value={company.recruiterName} />
          <InfoRow label="Position" value={company.recruiterRole} />
          <InfoRow label="Email" value={company.recruiterEmail} />
        </InfoCard>
      </div>

      <h2 className="text-sm font-bold text-kb-text-body mb-3">Verification Documents</h2>
      <div className="flex flex-col gap-3">
        {DOC_KEYS.map((key) => {
          const doc = company.docs[key];
          const style = STATUS_STYLES[doc.status];
          return (
            <div
              key={key}
              className="flex items-center gap-4 bg-kb-bg-card border border-kb-border rounded-2xl p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-kb-bg-alt flex items-center justify-center shrink-0">
                <FileText size={18} className="text-kb-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-kb-text-body">{doc.label}</p>
                <p className="text-xs text-kb-text-muted mt-0.5 truncate">{doc.fileName}</p>
              </div>
              <span
                className="text-xs font-semibold rounded-full px-2.5 py-1 shrink-0"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {style.label}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setDocStatus(key, "approved")}
                  className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors"
                  title="Approve"
                >
                  <Check size={15} color="#16A34A" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setDocStatus(key, "rejected")}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                  title="Reject"
                >
                  <X size={15} color="#ED4C5C" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
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
