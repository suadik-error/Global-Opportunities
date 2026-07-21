"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ImagePlus, X } from "lucide-react";
import { articles, type ArticleStatus } from "@/lib/mock-articles";

export default function ArticleEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";
  const existing = isNew ? undefined : articles.find((a) => a.id === params.id);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [duration, setDuration] = useState(existing?.duration ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [status, setStatus] = useState<ArticleStatus>(existing?.status ?? "draft");
  const [bannerImage, setBannerImage] = useState<string | undefined>(existing?.bannerImage);

  const pickBannerImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setBannerImage(URL.createObjectURL(file));
    };
    input.click();
  };

  if (!isNew && !existing) {
    return <p className="text-sm text-kb-text-muted">Article not found.</p>;
  }

  const isValid = title.trim() && category.trim() && summary.trim() && content.trim();

  const handleSave = () => {
    if (!isValid) return;
    // No backend yet — this mock demo just returns to the list.
    router.push("/content/articles");
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push("/content/articles")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Career Resources
      </button>

      <h1 className="text-xl font-bold text-kb-text-body mb-6">
        {isNew ? "New Article" : "Edit Article"}
      </h1>

      <div className="flex flex-col gap-4">
        <Field label="Banner Image">
          {bannerImage ? (
            <div className="relative rounded-lg overflow-hidden border border-kb-border-input h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bannerImage} alt="Article banner" className="w-full h-full object-cover" />
              <button
                onClick={() => setBannerImage(undefined)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/75 flex items-center justify-center transition-colors"
                title="Remove banner"
              >
                <X size={14} color="#FFFFFF" />
              </button>
              <button
                onClick={pickBannerImage}
                className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/75 text-white text-xs font-semibold transition-colors"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              onClick={pickBannerImage}
              className="flex flex-col items-center justify-center gap-2 w-full h-40 rounded-lg border border-dashed border-kb-border-input bg-kb-bg-alt hover:border-kb-primary transition-colors"
            >
              <ImagePlus size={22} className="text-kb-text-placeholder" />
              <span className="text-sm text-kb-text-muted">Click to upload a banner image</span>
            </button>
          )}
        </Field>

        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to write a developer resume that gets noticed"
            className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Resume Writing"
              className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
            />
          </Field>
          <Field label="Read Time">
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 5 min read"
              className="w-full h-11 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
            />
          </Field>
        </div>

        <Field label="Summary">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            placeholder="One or two sentences shown in the article list"
            className="w-full rounded-lg border border-kb-border-input px-3 py-2.5 text-sm text-kb-text-body outline-none focus:border-kb-primary resize-none"
          />
        </Field>

        <Field label="Content">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Full article body"
            className="w-full rounded-lg border border-kb-border-input px-3 py-2.5 text-sm text-kb-text-body outline-none focus:border-kb-primary resize-none"
          />
        </Field>

        <Field label="Status">
          <div className="flex gap-2">
            {(["draft", "published"] as ArticleStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  status === s
                    ? "bg-kb-primary text-white"
                    : "bg-kb-bg-card border border-kb-border text-kb-text-muted"
                }`}
              >
                {s === "draft" ? "Draft" : "Published"}
              </button>
            ))}
          </div>
        </Field>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className="mt-2 h-11 rounded-lg bg-kb-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {isNew ? "Publish Article" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-kb-text-body mb-1.5">{label}</label>
      {children}
    </div>
  );
}
