import { Users, Building2, Briefcase, Flag } from "lucide-react";
import { seekerAccounts } from "@/lib/mock-seekers";
import { hirerAccounts } from "@/lib/mock-hirers";
import { postedOpportunities, type OpportunityType } from "@/lib/mock-opportunities";
import { reports } from "@/lib/mock-reports";

const TYPE_LABELS: Record<OpportunityType, string> = {
  jobs: "Jobs",
  internships: "Internships",
  events: "Events",
  grants: "Grants",
};
const TYPE_COLORS: Record<OpportunityType, string> = {
  jobs: "#6671E4",
  internships: "#F59E0B",
  events: "#10B981",
  grants: "#EF4444",
};

export default function AnalyticsPage() {
  const totalApplications = seekerAccounts.reduce((sum, s) => sum + s.applicationsCount, 0);
  const activeSeekers = seekerAccounts.filter((s) => s.status === "active").length;
  const verifiedHirers = hirerAccounts.filter((h) => h.verification === "verified").length;
  const openReports = reports.filter((r) => r.status === "open").length;

  const typeCounts = (Object.keys(TYPE_LABELS) as OpportunityType[]).map((type) => ({
    type,
    count: postedOpportunities.filter((o) => o.type === type).length,
  }));
  const maxTypeCount = Math.max(...typeCounts.map((t) => t.count), 1);

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Platform Analytics</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        Cross-platform stats aggregated from Seekers, Hirers, Opportunities, and Trust & Safety.
      </p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Active Seekers" value={activeSeekers} sub={`of ${seekerAccounts.length} total`} color="#6671E4" />
        <StatCard icon={Building2} label="Verified Hirers" value={verifiedHirers} sub={`of ${hirerAccounts.length} total`} color="#16A34A" />
        <StatCard icon={Briefcase} label="Total Applications" value={totalApplications} sub="across all seekers" color="#F59E0B" />
        <StatCard icon={Flag} label="Open Reports" value={openReports} sub={`of ${reports.length} total`} color="#ED4C5C" />
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-6">
        <p className="text-sm font-bold text-kb-text-body mb-5">Postings by Type</p>
        <div className="flex flex-col gap-4">
          {typeCounts.map(({ type, count }) => (
            <div key={type} className="flex items-center gap-4">
              <span className="text-sm text-kb-text-muted w-24 shrink-0">{TYPE_LABELS[type]}</span>
              <div className="flex-1 h-3 rounded-full bg-kb-bg-alt overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(count / maxTypeCount) * 100}%`,
                    backgroundColor: TYPE_COLORS[type],
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-kb-text-body w-6 text-right shrink-0">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Icon size={18} color={color} />
      </div>
      <p className="text-2xl font-bold text-kb-text-body">{value}</p>
      <p className="text-xs text-kb-text-muted mt-1">{label}</p>
      <p className="text-[11px] text-kb-text-placeholder mt-0.5">{sub}</p>
    </div>
  );
}
