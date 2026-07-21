import Link from "next/link";
import {
  ShieldCheck, Briefcase, Users, Building2, Hash, Flag, BarChart3,
  Clock, CheckCircle2, XCircle, ArrowRight,
} from "lucide-react";
import { pendingCompanies } from "@/lib/mock-data";
import { postedOpportunities } from "@/lib/mock-opportunities";
import { seekerAccounts } from "@/lib/mock-seekers";
import { hirerAccounts } from "@/lib/mock-hirers";
import { channels } from "@/lib/mock-channels";
import { reports } from "@/lib/mock-reports";

export default function DashboardHomePage() {
  const pendingVerifications = pendingCompanies.filter((c) => c.overallStatus === "pending").length;
  const verifiedCompanies = pendingCompanies.filter((c) => c.overallStatus === "approved").length;
  const rejectedCompanies = pendingCompanies.filter((c) => c.overallStatus === "rejected").length;
  const pendingOpps = postedOpportunities.filter((o) => o.moderationStatus === "pending").length;
  const flaggedChannels = channels.filter((c) => c.status === "flagged").length;
  const openReports = reports.filter((r) => r.status === "open").length;

  const quickLinks = [
    {
      href: "/verification",
      icon: ShieldCheck,
      title: "Review pending verifications",
      sub: `${pendingVerifications} compan${pendingVerifications === 1 ? "y" : "ies"} waiting on document review`,
    },
    {
      href: "/opportunities",
      icon: Briefcase,
      title: "Review posted opportunities",
      sub: `${pendingOpps} posting${pendingOpps === 1 ? "" : "s"} awaiting moderation`,
    },
    {
      href: "/seekers",
      icon: Users,
      title: "Seekers Directory",
      sub: `${seekerAccounts.length} registered accounts`,
    },
    {
      href: "/hirers",
      icon: Building2,
      title: "Hirers Directory",
      sub: `${hirerAccounts.length} registered companies`,
    },
    {
      href: "/community",
      icon: Hash,
      title: "Community Channels",
      sub: `${flaggedChannels} flagged channel${flaggedChannels === 1 ? "" : "s"}`,
    },
    {
      href: "/reports",
      icon: Flag,
      title: "Reports Queue",
      sub: `${openReports} open report${openReports === 1 ? "" : "s"}`,
    },
    {
      href: "/analytics",
      icon: BarChart3,
      title: "Platform Analytics",
      sub: "Cross-platform stats",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Dashboard</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        Platform overview. More sections (content, taxonomy, events/grants, notifications, staff) are on the roadmap — see the sidebar.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={Clock} label="Pending Verification" value={pendingVerifications} color="#F6B612" />
        <StatCard icon={CheckCircle2} label="Verified Companies" value={verifiedCompanies} color="#16A34A" />
        <StatCard icon={XCircle} label="Rejected Companies" value={rejectedCompanies} color="#ED4C5C" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between bg-kb-bg-card border border-kb-border rounded-2xl p-5 hover:border-kb-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-kb-primary/10 flex items-center justify-center shrink-0">
                <link.icon size={20} color="#6671E4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-kb-text-body">{link.title}</p>
                <p className="text-xs text-kb-text-muted mt-0.5">{link.sub}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-kb-text-muted shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Clock;
  label: string;
  value: number;
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
    </div>
  );
}
