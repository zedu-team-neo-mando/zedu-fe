import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Hash, Layers } from "lucide-react";
import { getTemplateBySlug, TEMPLATES } from "~/data/templates";
import type { Metadata } from "next";
import { ogImageUrl } from "~/lib/env-urls";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Generates dynamic metadata for a template detail page.
 * @param props Route properties containing page params promise.
 * @returns Metadata object for the template route.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return { title: "Template Not Found" };
  const title = `${template.title} Workspace Template`;
  return {
    title,
    description: `${template.description} Includes #${template.channels.slice(0, 3).join(", #")}.`,
    openGraph: {
      title,
      description: template.description,
      url: `/templates/${template.slug}`,
      siteName: "Zedu",
      images: [
        {
          url: ogImageUrl("og-image-5.png"),
          width: 1200,
          height: 630,
          alt: "Zedu learning platform for educators and cohorts",
        },
      ],
    },
  };
}

/**
 * Pre-renders static route parameters for template presets.
 * @returns Array of route parameter objects for static generation.
 */
export const generateStaticParams = () =>
  TEMPLATES.map((t) => ({ slug: t.slug }));

/**
 * Detail view displaying channel architecture and AI assistant configurations.
 * @param props Route properties containing page params promise.
 * @returns Rendered template detail page or notFound.
 */
export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = getTemplateBySlug(slug);
  if (!t) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="size-4" /> Back to Templates Directory
        </Link>
        <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 sm:p-10 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#1E293B] text-cyan-400 border border-slate-700">
                {t.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                <span>{t.icon}</span> {t.title}
              </h1>
              <p className="text-sm text-slate-300">{t.subtitle}</p>
            </div>
            <Link
              href={`/auth/sign-up?template=${t.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20 shrink-0"
            >
              Use this template <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="text-sm text-slate-400 border-t border-slate-800/80 pt-4">
            {t.description}
          </p>
        </div>
        <div className="rounded-2xl bg-[#0C1322] border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Layers className="size-5 text-cyan-400" />
              <h2>Pre-Configured Channel Tree ({t.channels.length})</h2>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {t.channels.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-slate-800 text-xs font-mono text-slate-200"
                >
                  <Hash className="size-3.5 text-cyan-400" /> {c}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400">
            <span className="font-semibold text-white">
              🤖 Suggested AI assistant:{" "}
            </span>
            <span className="text-cyan-300 font-medium">{t.aiPreset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
