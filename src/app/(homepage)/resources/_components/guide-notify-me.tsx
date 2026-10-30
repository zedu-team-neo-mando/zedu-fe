"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { PostRequest } from "~/utils/request";
import { useToast } from "~/components/ui/use-toast";

interface GuideNotifyMeProps {
  title: string;
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const GuideNotifyMe = ({ title }: GuideNotifyMeProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    const req = await PostRequest("/newsletter", { email }, token);
    setLoading(false);

    if (req?.data?.status_code === 201) {
      setDone(true);
      setEmail("");
      toast({ description: "You're on the list!" });
    } else {
      setError(req?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (done) {
    return (
      <p className="mt-3 text-sm font-medium text-green-600" role="status">
        Thanks! We&apos;ll email you when this guide is live.
      </p>
    );
  }

  if (!open) {
    return (
      <div className="mt-3 flex items-center gap-3 text-sm font-medium">
        <span className="text-neutral-500">Coming soon</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-primary-500 transition-colors hover:text-primary-600 hover:underline"
          aria-label={`Notify me when "${title}" is published`}
        >
          Notify me →
        </button>
      </div>
    );
  }

  const inputId = `notify-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex flex-col gap-2"
      noValidate
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="flex h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1">
        <input
          id={inputId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="johndoe@example.com"
          className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-black placeholder:text-[#a0a0a0] focus:outline-none"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="relative flex h-full items-center justify-center rounded-md bg-primary-500 px-3 text-sm font-medium text-white transition-all hover:bg-opacity-80 disabled:opacity-60"
        >
          <span className={loading ? "opacity-0" : ""}>Notify me</span>
          {loading ? (
            <Loader2 className="absolute animate-spin" size={16} />
          ) : null}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};
