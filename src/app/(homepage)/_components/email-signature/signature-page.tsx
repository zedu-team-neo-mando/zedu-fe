"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Code2, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { showError, showSuccess } from "~/components/toast/sonner";
import { buildSignature } from "./build-signature";
import {
  DEFAULT_VALUES,
  SignatureForm,
  signatureSchema,
} from "./signature-form";
import type { SignatureValues } from "./signature-form";
import { ArrowBtn, OutlineBtn } from "../ui/Button";
import { DynamicFooter } from "../footer/dynamic-footer";

const CREDIT_UTM =
  "utm_source=email-signature&utm_medium=email&utm_campaign=signature-generator";

const STEPS: { client: string; how: string }[] = [
  {
    client: "Gmail",
    how: "Settings → See all settings → General → Signature → Create new, then paste.",
  },
  {
    client: "Outlook",
    how: "Settings → Accounts → Signatures → New signature, then paste.",
  },
  {
    client: "Apple Mail",
    how: "Mail → Settings → Signatures → +, untick “Always match my default message font”, then paste.",
  },
];

/** Copies the signature as formatted text, falling back to plain text. */
const copyRich = async (html: string, text: string): Promise<boolean> => {
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      return true;
    }
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

interface SignaturePageProps {
  /** The marketing site's address, read on the server (client code can't read it). */
  siteBase: string;
}

/**
 * Client-only email signature generator: builds the signature in the browser,
 * with no network requests and nothing stored.
 */
const SignaturePage = ({ siteBase }: SignaturePageProps) => {
  const form = useForm<SignatureValues>({
    resolver: zodResolver(signatureSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });
  const values = useWatch({ control: form.control }) as SignatureValues;
  const [status, setStatus] = useState("");

  const creditUrl = siteBase ? `${siteBase}/?${CREDIT_UTM}` : "";
  const signature = useMemo(
    () => buildSignature({ ...DEFAULT_VALUES, ...values }, creditUrl),
    [values, creditUrl]
  );

  const guardValid = async (): Promise<boolean> => {
    const ok = await form.trigger();
    if (!ok) {
      setStatus("Fix the highlighted fields before copying.");
      showError("Check your details", "Fix the highlighted fields first.");
    }
    return ok;
  };

  const handleCopy = async (): Promise<void> => {
    if (!(await guardValid())) return;
    if (await copyRich(signature.html, signature.text)) {
      showSuccess("Signature copied", "Paste it into your email settings.");
      setStatus("Signature copied. Paste it into your email settings.");
    } else {
      showError(
        "Couldn't copy to the clipboard",
        "Select the preview and copy it manually."
      );
      setStatus("The signature could not be copied. Select it manually.");
    }
  };

  const handleCopyHtml = async (): Promise<void> => {
    if (!(await guardValid())) return;
    if (await copyText(signature.html)) {
      showSuccess("HTML copied", "For clients that take an HTML signature.");
      setStatus("Signature HTML copied.");
    } else {
      showError(
        "Couldn't copy to the clipboard",
        "Try Copy signature instead."
      );
      setStatus("The HTML could not be copied.");
    }
  };

  return (
    <>
      {/* Intro */}
      <section className="relative isolate flex w-full flex-col items-center gap-5 overflow-hidden px-4 py-12 text-center sm:gap-6 sm:px-8 sm:py-16 lg:px-12">
        <div className="absolute inset-0 -z-10 size-full bg-blue-50/2" />
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-balance text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl md:text-4xl">
            A clean <span className="text-primary-500">email signature</span> in
            two minutes
          </h1>
          <p className="max-w-[95%] text-sm text-neutral-600 sm:max-w-[90%] sm:text-base md:max-w-[85%] lg:max-w-[65%] lg:text-lg">
            For teachers, tutors and programme teams. Fill in your details,
            watch the preview update, and copy a signature that pastes cleanly
            into Gmail, Outlook or Apple Mail. Add your Zedu community link and
            every email you send invites learners in. Free, no account needed.
          </p>
        </div>
        <OutlineBtn text="Make your signature" href="#signature-details" />
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[24rem_1fr]">
          {/* Form */}
          <section
            id="signature-details"
            className="scroll-mt-24"
            aria-labelledby="signature-details-title"
          >
            <h2
              id="signature-details-title"
              className="text-xl font-semibold text-neutral-900 sm:text-2xl"
            >
              Your details
            </h2>
            <p className="mb-4 mt-1 text-sm text-neutral-600">
              Only your name is required. Leave out anything you don&apos;t want
              people to see.
            </p>
            <SignatureForm form={form} />
          </section>

          {/* Preview */}
          <section
            aria-labelledby="signature-preview-title"
            className="flex flex-col gap-4 lg:sticky lg:top-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="signature-preview-title"
                className="text-xl font-semibold text-neutral-900 sm:text-2xl"
              >
                Preview
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopy}>
                  <Copy className="mr-1.5 size-4" aria-hidden="true" />
                  Copy signature
                </Button>
                <Button variant="outline" onClick={handleCopyHtml}>
                  <Code2 className="mr-1.5 size-4" aria-hidden="true" />
                  Copy HTML
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex flex-col gap-1 border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-xs text-neutral-500 sm:px-5">
                <span>
                  To:{" "}
                  <span className="text-neutral-700">a parent or learner</span>
                </span>
                <span>
                  Subject:{" "}
                  <span className="text-neutral-700">Week 3 class notes</span>
                </span>
              </div>
              <div className="flex flex-col gap-5 px-4 py-5 text-sm text-neutral-700 sm:px-5">
                <p>Hi everyone, this week&apos;s notes are attached.</p>
                {/* Every value is escaped and links are limited to http(s), mailto and tel in buildSignature. */}
                <div
                  className="overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: signature.html }}
                />
              </div>
            </div>

            <p className="min-h-5 text-sm text-primary-600" role="status">
              {status}
            </p>

            <div className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-neutral-900">
                Where to paste it
              </h3>
              <dl className="mt-3 flex flex-col gap-3 text-sm">
                {STEPS.map((step) => (
                  <div key={step.client}>
                    <dt className="font-medium text-neutral-800">
                      {step.client}
                    </dt>
                    <dd className="text-neutral-600">{step.how}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        {/* Signup CTA */}
        <section className="mt-14 rounded-2xl border border-primary-100 bg-primary-50/50 px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
            Need a community link to put in it?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-600 sm:text-base">
            Create a Zedu workspace for your class or cohort, copy its invite
            link, and paste it above. Channels, live sessions and AI help in one
            place, free to start.
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
    </>
  );
};

export default SignaturePage;
