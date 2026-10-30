"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClipboardList, Copy, Download, Printer } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { showSuccess, showError } from "~/components/toast/sonner";
import { EXAMPLE_INPUTS } from "./content";
import { generatePlan, isExampleInputs } from "./generate-plan";
import { channelPackToMarkdown, planToMarkdown } from "./plan-to-markdown";
import { CohortForm, DEFAULT_VALUES, formSchema } from "./cohort-form";
import type { FormValues } from "./cohort-form";
import { PlanPreview } from "./plan-preview";
import type { ChannelPack, CohortPlan } from "./types";
import { ArrowBtn, OutlineBtn } from "../ui/Button";
import { DynamicFooter } from "../footer/dynamic-footer";

const SECTION_LINKS: { href: string; label: string }[] = [
  { href: "#cohort-overview", label: "Overview" },
  { href: "#recommended-channels", label: "Channels" },
  { href: "#programme-roadmap", label: "Roadmap" },
  { href: "#communication-schedule", label: "Schedule" },
  { href: "#roles-responsibilities", label: "Roles" },
  { href: "#planning-checklist", label: "Checklist" },
];

/** Print-only stylesheet: prints the playbook alone, never the app chrome. */
const PRINT_CSS = `
@media print {
  body * { visibility: hidden !important; }
  .planner-print, .planner-print * { visibility: visible !important; }
  .planner-print { position: absolute; left: 0; top: 0; width: 100%; background: #fff; }
  .no-print, .no-print * { display: none !important; }
  @page { margin: 1.6cm; }
}
.planner-print { color: #171717; }
`;

const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Client-only Cohort Communication Planner: deterministic generation, no
 * network requests, no storage — plan data drives screen, copy, download,
 * and print from one structure.
 */
const PlannerPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const [plan, setPlan] = useState<CohortPlan | null>(null);
  const [status, setStatus] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const generate = (values: FormValues): void => {
    const next = generatePlan(values, { isExample: isExampleInputs(values) });
    setPlan(next);
    setStatus(
      `Plan generated: ${next.channels.length} recommended channels across ${next.overview.weeks} weeks.`
    );
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      resultsRef.current?.focus({ preventScroll: true });
    });
  };

  const handleExample = (): void => {
    form.reset(EXAMPLE_INPUTS);
    generate(EXAMPLE_INPUTS);
  };

  const handleCopyPack = async (pack: ChannelPack): Promise<void> => {
    const ok = await copyText(channelPackToMarkdown(pack));
    if (ok) {
      showSuccess(`${pack.name} launch pack copied.`);
      setStatus(`${pack.name} launch pack copied to the clipboard.`);
    } else {
      showError(
        "Couldn't copy to the clipboard",
        "Select the pack text and copy it manually."
      );
      setStatus(`${pack.name} could not be copied — select the text manually.`);
    }
  };

  const handleCopyAll = async (): Promise<void> => {
    if (!plan) return;
    const ok = await copyText(planToMarkdown(plan));
    if (ok) {
      showSuccess("Full Cohort Playbook copied.");
      setStatus("The full Cohort Playbook was copied to the clipboard.");
    } else {
      showError(
        "Couldn't copy to the clipboard",
        "Try the download button instead."
      );
      setStatus("The playbook could not be copied — use the download button.");
    }
  };

  const handleDownload = (): void => {
    if (!plan) return;
    const blob = new Blob([planToMarkdown(plan)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cohort-playbook.md";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showSuccess("Cohort Playbook downloaded", "Saved as cohort-playbook.md");
    setStatus("Cohort Playbook downloaded as cohort-playbook.md.");
  };

  const handlePrint = (): void => {
    const previousTitle = document.title;
    document.title = "Cohort Playbook";
    const restore = (): void => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
    setTimeout(restore, 1000);
  };

  return (
    <>
      {/* Intro */}
      <section className="no-print relative isolate flex w-full flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16 lg:px-12">
        <div className="absolute inset-0 -z-10 size-full bg-blue-50/2" />
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Plan your cohort&apos;s{" "}
            <span className="text-primary-500">communication</span> before day
            one
          </h1>
          <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[85%] lg:max-w-[65%] lg:text-lg">
            Answer four questions about your cohort, add your programme context,
            and get a personalised Cohort Playbook — recommended channels with
            launch packs, a week-by-week roadmap, a communication schedule,
            roles, and a planning checklist. Copy it, download it, or print it.
            No account needed.
          </p>
        </div>
        <OutlineBtn text="Build your plan" href="#cohort-configuration" />
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[24rem_1fr]">
          {/* Form */}
          <section
            id="cohort-configuration"
            className="no-print scroll-mt-24"
            aria-labelledby="cohort-configuration-title"
          >
            <h2
              id="cohort-configuration-title"
              className="text-xl font-semibold text-neutral-900 sm:text-2xl"
            >
              Cohort configuration
            </h2>
            <p className="mb-4 mt-1 text-sm text-neutral-600">
              Four core questions, plus optional programme context for a sharper
              roadmap.
            </p>
            <CohortForm
              form={form}
              hasPlan={plan !== null}
              onSubmit={form.handleSubmit(generate)}
              onExample={handleExample}
            />
          </section>

          {/* Results */}
          <div
            ref={resultsRef}
            tabIndex={-1}
            className="planner-print scroll-mt-24 outline-none"
          >
            <p role="status" aria-live="polite" className="sr-only">
              {status}
            </p>

            {!plan ? (
              <div className="no-print flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-neutral-200 px-6 py-16 text-center">
                <ClipboardList
                  className="size-10 text-neutral-300"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Your Cohort Playbook will appear here
                  </h2>
                  <p className="mt-1 max-w-md text-sm text-neutral-600">
                    Fill in the form and generate your plan — or preview the
                    example plan first to see what you&apos;ll get.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="no-print flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-neutral-900">
                      Your Cohort Playbook
                      {plan.isExample && (
                        <span className="ml-2 align-middle rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-600">
                          Example
                        </span>
                      )}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={handleCopyAll}>
                        <Copy className="mr-1.5 size-4" aria-hidden="true" />
                        Copy all
                      </Button>
                      <Button onClick={handleDownload}>
                        <Download
                          className="mr-1.5 size-4"
                          aria-hidden="true"
                        />
                        Download .md
                      </Button>
                      <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-1.5 size-4" aria-hidden="true" />
                        Print / Save as PDF
                      </Button>
                    </div>
                  </div>

                  {plan.isExample && (
                    <Alert className="border-primary-200 bg-primary-50/60 text-primary-900">
                      <AlertDescription>
                        This is the built-in example plan. Change any input and
                        regenerate to build your own.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Alert className="border-amber-300 bg-amber-50 text-amber-900">
                    <AlertDescription>
                      Your plan is not saved automatically — download or copy it
                      before you leave this page.
                    </AlertDescription>
                  </Alert>

                  <nav
                    aria-label="Plan sections"
                    className="flex flex-wrap gap-2"
                  >
                    {SECTION_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-primary-300 hover:text-primary-600"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>

                  <p className="min-h-5 text-sm text-primary-600" role="status">
                    {status}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-6">
                  <PlanPreview plan={plan} onCopyPack={handleCopyPack} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Signup CTA */}
        <section className="no-print mt-14 rounded-2xl border border-primary-100 bg-primary-50/50 px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
            Ready to run your cohort on Zedu?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-600 sm:text-base">
            Your playbook needs a home. Zedu gives your cohort channels, live
            sessions, and AI assistance in one workspace — free to start.
          </p>
          <div className="mt-5 flex justify-center">
            <ArrowBtn text="Sign up free" href="/auth/sign-up" />
          </div>
        </section>
      </main>

      <DynamicFooter
        text="Need Help Getting Started?"
        description="Find answers, tutorials, and support resources in our comprehensive help center designed for educators and administrators."
      />

      <style>{PRINT_CSS}</style>
    </>
  );
};

export default PlannerPage;
