import Link from "next/link";
import { ChevronRight, Hash } from "lucide-react";
import { channels, type ChannelStatus } from "@/lib/mock-channels";

const STATUS_STYLES: Record<ChannelStatus, { bg: string; text: string; label: string }> = {
  active: { bg: "#F0FDF4", text: "#16A34A", label: "Active" },
  flagged: { bg: "#FFFBEB", text: "#B7791F", label: "Flagged" },
  removed: { bg: "#FEF2F2", text: "#ED4C5C", label: "Removed" },
};

export default function CommunityChannelsPage() {
  const flaggedCount = channels.filter((c) => c.status === "flagged").length;

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">Community Channels</h1>
      <p className="text-sm text-kb-text-muted mb-6">
        All channels across the platform. {flaggedCount} flagged for review.
      </p>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.8fr_1.4fr_1fr_1fr_1fr_20px] gap-4 px-5 py-3 border-b border-kb-border text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder">
          <span>Channel</span>
          <span>Owner</span>
          <span>Followers</span>
          <span>Posts</span>
          <span>Status</span>
          <span />
        </div>

        {channels.map((channel) => {
          const style = STATUS_STYLES[channel.status];
          return (
            <Link
              key={channel.id}
              href={`/community/${channel.id}`}
              className="grid grid-cols-[1.8fr_1.4fr_1fr_1fr_1fr_20px] gap-4 px-5 py-4 items-center border-b border-kb-border last:border-b-0 hover:bg-kb-bg-alt transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-kb-bg-alt flex items-center justify-center shrink-0">
                  <Hash size={16} className="text-kb-text-muted" />
                </div>
                <span className="text-sm font-semibold text-kb-text-body truncate" title={channel.name}>
                  {channel.name}
                </span>
              </div>
              <span className="text-sm text-kb-text-muted truncate">{channel.owner}</span>
              <span className="text-sm text-kb-text-muted truncate">{channel.followers}</span>
              <span className="text-sm text-kb-text-muted truncate">{channel.postsCount}</span>
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
