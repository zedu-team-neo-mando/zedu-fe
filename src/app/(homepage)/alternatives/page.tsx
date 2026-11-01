import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl, ogImageUrl } from "~/lib/env-urls";
import { DynamicFooter } from "../_components/footer/dynamic-footer";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Layers,
  Shield,
  Clock,
  DollarSign,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Competitor Comparison & Migration Hub | Zedu",
  description:
    "Explore why top bootcamps, schools, and cohort academies are switching from Slack and Discord to Zedu. Compare features, calculate cost savings, and migrate in 5 minutes.",
  keywords: [
    "slack alternative for education",
    "discord alternative for schools",
    "slack vs discord for classroom",
    "bootcamp communication platform",
    "cohort management software",
    "education chat platform comparison",
  ],
  openGraph: {
    title: "Zedu Competitor Comparison & Migration Hub",
    description:
      "See why educators are replacing Slack's $8.75/student paywall and Discord's gaming noise with Zedu's education-first platform.",
    url: siteUrl("/alternatives"),
    siteName: "Zedu",
    images: [
      {
        url: ogImageUrl("og-image-5.png"),
        width: 1200,
        height: 630,
        alt: "Zedu Competitor Alternatives and Comparison Hub",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zedu Competitor Comparison & Migration Hub",
    description:
      "Explore why top educators choose Zedu over Slack and Discord for structured cohorts and interactive learning.",
    images: [ogImageUrl("og-image-5.png")],
  },
  alternates: {
    canonical: siteUrl("/alternatives"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AlternativesHubPage() {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": siteUrl("/#organization"),
        name: "Zedu",
        url: siteUrl("/"),
        logo: siteUrl("/Zedu.png"),
      },
      {
        "@type": "CollectionPage",
        "@id": siteUrl("/alternatives#webpage"),
        url: siteUrl("/alternatives"),
        name: "Zedu Competitor Comparison & Migration Hub",
        description:
          "Detailed comparisons and migration guides for educators switching from Slack, Discord, and traditional chat software to Zedu.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Alternatives Hub",
            item: siteUrl("/alternatives"),
          },
        ],
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <div className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      {/* Hero */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 text-center">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center justify-center gap-1.5 text-xs text-neutral-500"
        >
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-800 font-medium">Alternatives Hub</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 border border-primary-200 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span>Competitor Migration &amp; Comparison Hub</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-tight max-w-4xl mx-auto">
          The Education-First Alternative to Generic Workplace Chat
        </h1>

        <p className="mt-6 text-base sm:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          Generic business chat apps and gamer servers weren&apos;t designed for
          teaching cohorts. Discover why bootcamps, schools, and academies
          choose Zedu for structured learning, native whiteboards, and 90% lower
          total software costs.
        </p>
      </section>

      {/* Comparison Cards Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Slack Alternative Card */}
          <div className="rounded-3xl border-2 border-neutral-200 hover:border-primary-400 bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full pointer-events-none group-hover:bg-primary-100 transition-colors"></div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
                Avoid 90-Day History Cutoff
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                Slack Alternative for Education
              </h2>
              <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
                Replace Slack&apos;s punitive $8.75/student/month pricing and
                90-day history deletion. Zedu gives you permanent search,
                built-in collaborative whiteboards, and flat cohort rates.
              </p>

              <div className="mt-6 space-y-2.5 text-xs sm:text-sm text-neutral-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited permanent message history free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Flat cohort pricing (save $15,000+/year for 150 students)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Native whiteboard (no $16/seat Miro needed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Week-by-week structured curriculum channels</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/alternatives/slack-for-education"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all"
              >
                Compare Slack vs. Zedu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/sign-up?source=slack-alternative&template=education-cohort"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
              >
                Migrate in 5 Mins &rarr;
              </Link>
            </div>
          </div>

          {/* Discord Alternative Card */}
          <div className="rounded-3xl border-2 border-neutral-200 hover:border-primary-400 bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full pointer-events-none group-hover:bg-primary-100 transition-colors"></div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
                Distraction-Free Classroom
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                Discord Alternative for Schools
              </h2>
              <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
                Eliminate gaming statuses (&quot;Playing League of
                Legends&quot;), Nitro spam, and FERPA privacy liabilities. Give
                your students a serious, focused learning workspace with
                verified roles.
              </p>

              <div className="mt-6 space-y-2.5 text-xs sm:text-sm text-neutral-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% academic focus with zero gaming alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    FERPA-aligned student privacy &amp; verified identities
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Native collaborative whiteboard built directly in channels
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High-capacity file sharing without Nitro paywalls</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/alternatives/discord-for-schools"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all"
              >
                Compare Discord vs. Zedu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/sign-up?source=discord-alternative&template=education-cohort"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
              >
                Migrate in 5 Mins &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Funnel Footer */}
      <DynamicFooter
        text="Switch to the Platform Built for Teaching"
        description="Join thousands of educators running cohorts on Zedu without student seat penalties."
      />
    </div>
  );
}
