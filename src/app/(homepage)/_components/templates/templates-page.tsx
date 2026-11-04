"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "~/data/templates";

/**
 * Directory page for browsing and searching community cohort templates.
 * @returns Rendered template directory page component.
 */
export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return TEMPLATES.filter(
      (t) =>
        (activeCategory === "All" || t.category === activeCategory) &&
        (!q ||
          `${t.title} ${t.subtitle} ${t.channels.join(" ")}`
            .toLowerCase()
            .includes(q))
    );
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-4">
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#2DD4BF] uppercase">
            COMMUNITY TEMPLATES
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Launch Your Cohort Workspace in Seconds
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Pre-built channel architectures and AI setup suggestions for modern
            learning.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto w-full">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              aria-label="Search templates"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-[#0F172A]/90 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
          <div
            className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center"
            role="tablist"
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${activeCategory === cat ? "bg-[#1E293B] text-white border border-slate-600 shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filtered.map((t) => (
            <div
              key={t.slug}
              className="flex flex-col justify-between rounded-2xl bg-[#0C1322] border border-slate-800 hover:border-cyan-500/50 p-6 transition duration-200 shadow-lg"
            >
              <div className="space-y-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{t.icon}</span> {t.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {t.subtitle}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    CHANNELS INCLUDED
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-300 font-mono">
                    {t.channels.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                      >
                        #{c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">
                    Suggested AI:
                  </span>
                  <span>🤖 {t.aiPreset}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-800/80">
                <Link
                  href={`/templates/${t.slug}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-200 transition"
                >
                  Preview
                </Link>
                <Link
                  href={`/auth/sign-up?template=${t.slug}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-slate-950 font-semibold text-xs sm:text-sm transition"
                >
                  Use Template <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 text-center space-y-3 max-w-4xl mx-auto mt-12">
          <h3 className="text-base font-semibold text-white">
            Need custom workspace?
          </h3>
          <Link
            href="/contact-sales"
            className="inline-block px-5 py-2 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100"
          >
            Request Migration Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
