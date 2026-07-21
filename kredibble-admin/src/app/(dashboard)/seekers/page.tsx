"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { seekerAccounts } from "@/lib/mock-seekers";

export default function SeekersDirectoryPage() {
  const [query, setQuery] = useState("");

  const filtered = seekerAccounts.filter((s) =>
    `${s.name} ${s.email} ${s.university} ${s.country}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Seekers Directory</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        {seekerAccounts.length} seeker accounts registered on the platform.
      </p>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kb-text-placeholder" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, university..."
          className="w-full h-10 rounded-lg border border-kb-border-input bg-kb-bg-card pl-9 pr-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
        />
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1.6fr_1fr_0.8fr_0.8fr_1fr_20px] gap-4 px-5 py-3 border-b border-kb-border text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder">
          <span>Name</span>
          <span>University</span>
          <span>Country</span>
          <span>Applied</span>
          <span>Saved</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.map((seeker) => (
          <Link
            key={seeker.id}
            href={`/seekers/${seeker.id}`}
            className="grid grid-cols-[1.6fr_1.6fr_1fr_0.8fr_0.8fr_1fr_20px] gap-4 px-5 py-4 items-center border-b border-kb-border last:border-b-0 hover:bg-kb-bg-alt transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-kb-text-body truncate">{seeker.name}</p>
              <p className="text-xs text-kb-text-muted mt-0.5 truncate">{seeker.email}</p>
            </div>
            <span className="text-sm text-kb-text-muted min-w-0 truncate" title={seeker.university}>
              {seeker.university}
            </span>
            <span className="text-sm text-kb-text-muted truncate">{seeker.country}</span>
            <span className="text-sm text-kb-text-muted">{seeker.applicationsCount}</span>
            <span className="text-sm text-kb-text-muted">{seeker.savedCount}</span>
            <span
              className="inline-flex w-fit text-xs font-semibold rounded-full px-2.5 py-1"
              style={
                seeker.status === "active"
                  ? { backgroundColor: "#F0FDF4", color: "#16A34A" }
                  : { backgroundColor: "#FEF2F2", color: "#ED4C5C" }
              }
            >
              {seeker.status === "active" ? "Active" : "Suspended"}
            </span>
            <ChevronRight size={18} className="text-kb-text-placeholder justify-self-end" />
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-kb-text-muted">No seekers match your search.</div>
        )}
      </div>
    </div>
  );
}
