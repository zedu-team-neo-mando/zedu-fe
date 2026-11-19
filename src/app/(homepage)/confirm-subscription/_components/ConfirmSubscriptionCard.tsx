"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  INVALID_CONFIRMATION_LINK_MESSAGE,
  confirmNewsletterSubscription,
} from "~/lib/newsletter";

type ConfirmSubscriptionCardProps = {
  email: string;
  token: string;
};

type Status = "idle" | "loading" | "done" | "error";

const ConfirmSubscriptionCard = ({
  email,
  token,
}: ConfirmSubscriptionCardProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const linkIsUsable = Boolean(email && token);

  const handleConfirm = async () => {
    setStatus("loading");
    setError("");

    const result = await confirmNewsletterSubscription(email, token);

    if (result.ok) {
      setStatus("done");
      return;
    }

    setError(result.error);
    setStatus("error");
  };

  return (
    <section
      aria-labelledby="confirm-subscription-heading"
      className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
    >
      {status === "done" ? (
        <>
          <h1
            id="confirm-subscription-heading"
            className="text-2xl font-bold text-gray-900"
          >
            You&apos;re subscribed
          </h1>
          <p role="status" className="mt-3 text-gray-600">
            <span className="break-words font-medium text-gray-900">
              {email}
            </span>{" "}
            will now receive the Zedu newsletter.
          </p>
        </>
      ) : linkIsUsable ? (
        <>
          <h1
            id="confirm-subscription-heading"
            className="text-2xl font-bold text-gray-900"
          >
            Confirm your subscription
          </h1>
          <p className="mt-3 text-gray-600">
            Send the Zedu newsletter to{" "}
            <span className="break-words font-medium text-gray-900">
              {email}
            </span>
            ?
          </p>
          {status === "error" && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={status === "loading"}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "loading" ? "Confirming..." : "Confirm subscription"}
          </button>
        </>
      ) : (
        <>
          <h1
            id="confirm-subscription-heading"
            className="text-2xl font-bold text-gray-900"
          >
            This confirmation link doesn&apos;t work
          </h1>
          <p role="alert" className="mt-3 text-gray-600">
            {INVALID_CONFIRMATION_LINK_MESSAGE}
          </p>
        </>
      )}

      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-purple-700 underline underline-offset-4 hover:text-purple-900"
      >
        Back to Zedu
      </Link>
    </section>
  );
};

export default ConfirmSubscriptionCard;
