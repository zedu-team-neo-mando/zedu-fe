"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import Link from "next/link";
import { contactSalesUrl } from "~/lib/env-urls";

type FormValues = {
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  programName: string;
  contactName: string;
  contactEmail: string;
  programSize: string;
  note: string;
  permission: boolean;
  website: string;
};

const emptyForm: FormValues = {
  referrerName: "",
  referrerEmail: "",
  referrerPhone: "",
  programName: "",
  contactName: "",
  contactEmail: "",
  programSize: "",
  note: "",
  permission: false,
  website: "",
};

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#6042EC] focus:ring-2 focus:ring-[#6042EC]/20";

export function ReferProgramForm() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || sent) return;
    if (form.website) {
      setSent(true);
      return;
    }

    if (
      !form.referrerName.trim() ||
      !form.programName.trim() ||
      !form.contactName.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.referrerEmail.trim()) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())
    ) {
      setError("Enter a valid email address for you and your contact.");
      return;
    }
    if (
      !/^\+?[0-9\s()-]+$/.test(form.referrerPhone) ||
      form.referrerPhone.replace(/\D/g, "").length < 10
    ) {
      setError(
        "Enter a valid phone number so our team can follow up with you."
      );
      return;
    }
    if (!form.programSize || !form.permission) {
      setError(
        "Choose a program size and confirm you have permission to share these details."
      );
      return;
    }

    setSending(true);
    const message = [
      "Program referral",
      `Referrer: ${form.referrerName.trim()} (${form.referrerEmail.trim()})`,
      `Program: ${form.programName.trim()}`,
      `Program size: ${form.programSize}`,
      `Contact person: ${form.contactName.trim()} (${form.contactEmail.trim()})`,
      `Permission confirmed: ${form.permission ? "yes" : "no"}`,
      form.note.trim() ? `Note: ${form.note.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch(contactSalesUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.referrerName.trim(),
          email: form.referrerEmail.trim(),
          phone_number: form.referrerPhone.replace(/\D/g, ""),
          organization_type: form.programSize,
          message,
        }),
      });
      if (!response.ok) throw new Error("Referral could not be submitted");
      setSent(true);
      setForm(emptyForm);
    } catch {
      setError("We couldn’t send your referral. Please try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-950"
      >
        <h3 className="text-xl font-semibold">Thanks for the introduction!</h3>
        <p className="mt-2 leading-6">
          Our team has received your referral and will follow up with you.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid min-w-0 grid-cols-1 gap-5 rounded-3xl bg-white p-6 shadow-[0_28px_60px_-18px_rgba(38,24,102,0.22)] ring-1 ring-[#6f4ef6]/10 sm:grid-cols-2 sm:p-8"
    >
      <div className="sm:col-span-2">
        <label
          htmlFor="referral-name"
          className="text-sm font-medium text-neutral-800"
        >
          Your name *
        </label>
        <input
          id="referral-name"
          autoComplete="name"
          required
          value={form.referrerName}
          onChange={(event) => update("referrerName", event.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="referral-email"
          className="text-sm font-medium text-neutral-800"
        >
          Your email *
        </label>
        <input
          id="referral-email"
          type="email"
          autoComplete="email"
          required
          value={form.referrerEmail}
          onChange={(event) => update("referrerEmail", event.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="referral-phone"
          className="text-sm font-medium text-neutral-800"
        >
          Your phone *
        </label>
        <input
          id="referral-phone"
          type="tel"
          autoComplete="tel"
          required
          value={form.referrerPhone}
          onChange={(event) => update("referrerPhone", event.target.value)}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="program-name"
          className="text-sm font-medium text-neutral-800"
        >
          Program or school name *
        </label>
        <input
          id="program-name"
          required
          value={form.programName}
          onChange={(event) => update("programName", event.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-neutral-800"
        >
          Contact person *
        </label>
        <input
          id="contact-name"
          required
          value={form.contactName}
          onChange={(event) => update("contactName", event.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-neutral-800"
        >
          Contact email *
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={form.contactEmail}
          onChange={(event) => update("contactEmail", event.target.value)}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="program-size"
          className="text-sm font-medium text-neutral-800"
        >
          Program size *
        </label>
        <select
          id="program-size"
          required
          value={form.programSize}
          onChange={(event) => update("programSize", event.target.value)}
          className={inputClass}
        >
          <option value="">Select an approximate size</option>
          <option value="1–50 learners">1–50 learners</option>
          <option value="51–200 learners">51–200 learners</option>
          <option value="201–500 learners">201–500 learners</option>
          <option value="501+ learners">501+ learners</option>
          <option value="Not sure">Not sure</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="referral-note"
          className="text-sm font-medium text-neutral-800"
        >
          Anything else?{" "}
          <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="referral-note"
          rows={4}
          maxLength={1500}
          value={form.note}
          onChange={(event) => update("note", event.target.value)}
          className={`${inputClass} h-auto resize-y py-3`}
        />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="referral-website">Leave this field empty</label>
        <input
          id="referral-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
          <input
            type="checkbox"
            required
            checked={form.permission}
            onChange={(event) => update("permission", event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#6042EC]"
          />
          <span>
            I have permission to share this contact’s details with Zedu so the
            team can contact them about the referral. I have read the{" "}
            <Link
              href="/policy"
              className="font-medium text-[#6042EC] underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>
      {error ? (
        <p
          role="alert"
          className="sm:col-span-2 text-sm font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={sending}
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#6042EC] px-6 font-semibold text-white transition hover:bg-[#5033d2] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {sending ? "Sending referral…" : "Send referral"}
      </button>
      <p className="sm:col-span-2 text-xs leading-5 text-neutral-500">
        Submitting this form asks the Zedu team to follow up about this
        introduction. Referral rewards and terms are not yet final.
      </p>
    </form>
  );
}
