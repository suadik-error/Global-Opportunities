"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export interface TaxonomyTab {
  label: string;
  items: string[];
}

export function TaxonomyManager({ title, subtitle, tabs }: { title: string; subtitle: string; tabs: TaxonomyTab[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [tabItems, setTabItems] = useState<string[][]>(tabs.map((t) => t.items));
  const [newValue, setNewValue] = useState("");

  const items = tabItems[activeTab];

  const addItem = () => {
    const value = newValue.trim();
    if (!value || items.includes(value)) return;
    setTabItems((prev) => prev.map((list, i) => (i === activeTab ? [...list, value] : list)));
    setNewValue("");
  };

  const removeItem = (value: string) => {
    setTabItems((prev) => prev.map((list, i) => (i === activeTab ? list.filter((v) => v !== value) : list)));
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-kb-text-body mb-1">{title}</h1>
      <p className="text-sm text-kb-text-muted mb-6">{subtitle}</p>

      <div className="flex items-center gap-2 mb-5">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              activeTab === i
                ? "bg-kb-primary text-white"
                : "bg-kb-bg-card border border-kb-border text-kb-text-muted hover:text-kb-text-body"
            }`}
          >
            {tab.label} ({tabItems[i].length})
          </button>
        ))}
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder={`Add a new ${tabs[activeTab].label.toLowerCase().replace(/s$/, "")}...`}
            className="flex-1 h-10 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
          />
          <button
            onClick={addItem}
            disabled={!newValue.trim()}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-lg bg-kb-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 bg-kb-bg-alt border border-kb-border rounded-full pl-3 pr-2 py-1.5 text-sm text-kb-text-body"
            >
              {item}
              <button
                onClick={() => removeItem(item)}
                className="w-4 h-4 rounded-full bg-kb-text-placeholder/20 hover:bg-red-100 flex items-center justify-center transition-colors"
              >
                <X size={10} className="text-kb-text-muted" />
              </button>
            </span>
          ))}
          {items.length === 0 && <p className="text-sm text-kb-text-muted">No entries yet — add one above.</p>}
        </div>
      </div>
    </div>
  );
}
