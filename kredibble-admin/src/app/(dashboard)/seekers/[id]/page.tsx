"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Ban, RotateCcw } from "lucide-react";
import { seekerAccounts, type SeekerAccount } from "@/lib/mock-seekers";

export default function SeekerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = seekerAccounts.find((s) => s.id === params.id);
  const [seeker, setSeeker] = useState<SeekerAccount | undefined>(original);

  if (!seeker) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Seeker not found.</p>
        <Link href="/seekers" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Seekers Directory
        </Link>
      </div>
    );
  }

  const toggleStatus = () => {
    setSeeker((prev) =>
      prev ? { ...prev, status: prev.status === "active" ? "suspended" : "active" } : prev
    );
  };

  const isActive = seeker.status === "active";

  return (
    <div>
      <button
        onClick={() => router.push("/seekers")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Seekers Directory
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-kb-text-body">{seeker.name}</h1>
          <p className="text-sm text-kb-text-muted mt-1">{seeker.profession}</p>
        </div>
        <span
          className="text-xs font-semibold rounded-full px-3 py-1.5"
          style={
            isActive ? { backgroundColor: "#F0FDF4", color: "#16A34A" } : { backgroundColor: "#FEF2F2", color: "#ED4C5C" }
          }
        >
          {isActive ? "Active" : "Suspended"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoCard title="Account">
          <InfoRow label="Email" value={seeker.email} />
          <InfoRow label="University" value={seeker.university} />
          <InfoRow label="Country" value={seeker.country} />
          <InfoRow label="Joined" value={seeker.joinedDate} />
        </InfoCard>
        <InfoCard title="Activity">
          <InfoRow label="Applications submitted" value={String(seeker.applicationsCount)} />
          <InfoRow label="Saved opportunities" value={String(seeker.savedCount)} />
        </InfoCard>
      </div>

      <button
        onClick={toggleStatus}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          isActive
            ? "bg-red-50 hover:bg-red-100 text-red-600"
            : "bg-green-50 hover:bg-green-100 text-green-700"
        }`}
      >
        {isActive ? <Ban size={16} strokeWidth={2.5} /> : <RotateCcw size={16} strokeWidth={2.5} />}
        {isActive ? "Suspend account" : "Reinstate account"}
      </button>
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
