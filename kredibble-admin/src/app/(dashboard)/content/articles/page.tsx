import Link from "next/link";
import { ChevronRight, FileText, Plus } from "lucide-react";
import { articles } from "@/lib/mock-articles";

export default function ArticlesListPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-kb-text-body">Career Resources</h1>
        <Link
          href="/content/articles/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-kb-primary text-white text-sm font-semibold"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Article
        </Link>
      </div>
      <p className="text-sm text-kb-text-muted mb-6">
        Articles shown in the Career Resources section of the app. {articles.filter((a) => a.status === "draft").length} draft{" "}
        not yet published.
      </p>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_20px] gap-4 px-5 py-3 border-b border-kb-border text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder">
          <span>Title</span>
          <span>Category</span>
          <span>Read Time</span>
          <span>Status</span>
          <span />
        </div>

        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/content/articles/${article.id}`}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_20px] gap-4 px-5 py-4 items-center border-b border-kb-border last:border-b-0 hover:bg-kb-bg-alt transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {article.bannerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.bannerImage}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-kb-bg-alt flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-kb-text-muted" />
                </div>
              )}
              <span className="text-sm font-semibold text-kb-text-body truncate" title={article.title}>
                {article.title}
              </span>
            </div>
            <span className="text-sm text-kb-text-muted truncate">{article.category}</span>
            <span className="text-sm text-kb-text-muted truncate">{article.duration}</span>
            <span
              className="inline-flex w-fit text-xs font-semibold rounded-full px-2.5 py-1"
              style={
                article.status === "published"
                  ? { backgroundColor: "#F0FDF4", color: "#16A34A" }
                  : { backgroundColor: "#F3F4F6", color: "#6B7280" }
              }
            >
              {article.status === "published" ? "Published" : "Draft"}
            </span>
            <ChevronRight size={18} className="text-kb-text-placeholder justify-self-end" />
          </Link>
        ))}
      </div>
    </div>
  );
}
