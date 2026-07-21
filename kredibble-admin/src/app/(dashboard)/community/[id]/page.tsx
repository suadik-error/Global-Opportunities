"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trash2, Flag, Ban, RotateCcw } from "lucide-react";
import { channels, type Channel, type ChannelStatus } from "@/lib/mock-channels";

const STATUS_STYLES: Record<ChannelStatus, { bg: string; text: string; label: string }> = {
  active: { bg: "#F0FDF4", text: "#16A34A", label: "Active" },
  flagged: { bg: "#FFFBEB", text: "#B7791F", label: "Flagged" },
  removed: { bg: "#FEF2F2", text: "#ED4C5C", label: "Removed" },
};

export default function ChannelReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = channels.find((c) => c.id === params.id);
  const [channel, setChannel] = useState<Channel | undefined>(original);

  if (!channel) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Channel not found.</p>
        <Link href="/community" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Community Channels
        </Link>
      </div>
    );
  }

  const removePost = (postId: string) => {
    setChannel((prev) => (prev ? { ...prev, posts: prev.posts.filter((p) => p.id !== postId) } : prev));
  };

  const toggleChannelStatus = () => {
    setChannel((prev) =>
      prev ? { ...prev, status: prev.status === "removed" ? "active" : "removed" } : prev
    );
  };

  const style = STATUS_STYLES[channel.status];
  const isRemoved = channel.status === "removed";

  return (
    <div>
      <button
        onClick={() => router.push("/community")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Community Channels
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-kb-text-body">{channel.name}</h1>
          <p className="text-sm text-kb-text-muted mt-1">
            {channel.owner} · {channel.followers}
          </p>
        </div>
        <span
          className="text-xs font-semibold rounded-full px-3 py-1.5"
          style={{ backgroundColor: style.bg, color: style.text }}
        >
          {style.label}
        </span>
      </div>

      <h2 className="text-sm font-bold text-kb-text-body mb-3">Posts</h2>
      <div className="flex flex-col gap-3 mb-6">
        {channel.posts.length === 0 && (
          <p className="text-sm text-kb-text-muted">No posts in this channel.</p>
        )}
        {channel.posts.map((post) => (
          <div
            key={post.id}
            className={`bg-kb-bg-card border rounded-2xl p-4 ${
              post.flagged ? "border-red-200" : "border-kb-border"
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-sm font-semibold text-kb-text-body">{post.authorName}</p>
                <p className="text-xs text-kb-text-muted mt-0.5">{post.date}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {post.flagged && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 rounded-full px-2.5 py-1">
                    <Flag size={11} />
                    Flagged
                  </span>
                )}
                <button
                  onClick={() => removePost(post.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                  title="Remove post"
                >
                  <Trash2 size={14} color="#ED4C5C" />
                </button>
              </div>
            </div>
            <p className="text-sm text-kb-text-body leading-relaxed">{post.body}</p>
          </div>
        ))}
      </div>

      <button
        onClick={toggleChannelStatus}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          isRemoved
            ? "bg-green-50 hover:bg-green-100 text-green-700"
            : "bg-red-50 hover:bg-red-100 text-red-600"
        }`}
      >
        {isRemoved ? <RotateCcw size={16} strokeWidth={2.5} /> : <Ban size={16} strokeWidth={2.5} />}
        {isRemoved ? "Restore channel" : "Remove channel"}
      </button>
    </div>
  );
}
