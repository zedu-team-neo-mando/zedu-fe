"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  createCalculatorResultImage,
  downloadCalculatorResultImage,
  shareCalculatorResultImage,
  type CalculatorResult,
} from "./calculator-result-image";

export function CalculatorResultActions({
  result,
}: {
  result: CalculatorResult;
}) {
  const [prepared, setPrepared] = useState<{
    result: CalculatorResult;
    file: File;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setPrepared(null);
    setMessage("");
    setError(false);
    // Prepare before the share click: some browsers expire the click gesture
    // if image generation is awaited while opening the native share sheet.
    const timer = window.setTimeout(() => {
      createCalculatorResultImage(result)
        .then((file) => {
          if (!cancelled) setPrepared({ result, file });
        })
        .catch(() => {
          if (!cancelled) {
            setError(true);
            setMessage("We couldn't prepare your image. Please try again.");
          }
        });
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [result, retry]);

  const ready = prepared?.result === result;

  const handleAction = async (action: "save" | "share") => {
    if (!ready || !prepared || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(false);
    setMessage("");
    try {
      if (action === "save") {
        downloadCalculatorResultImage(prepared.file);
        setMessage("Your result image is downloading.");
      } else {
        const outcome = await shareCalculatorResultImage(prepared.file);
        if (outcome === "shared")
          setMessage("Share options opened for your result image.");
        if (outcome === "downloaded")
          setMessage(
            "Image sharing isn't available here. Your image is downloading so you can post it yourself."
          );
      }
    } catch {
      setError(true);
      setMessage("We couldn't save your image. Please try again.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const buttonClass =
    "flex-1 gap-1.5 border-primary-200 text-xs text-primary-500 hover:bg-primary-50 hover:text-primary-600";

  return (
    <div className="space-y-1.5">
      <div
        className="flex flex-wrap gap-2"
        aria-label="Save or share calculator results"
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={buttonClass}
          disabled={!ready || busy}
          onClick={() => void handleAction("save")}
          aria-label="Save calculator result as image"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Save image
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={buttonClass}
          disabled={!ready || busy}
          onClick={() => void handleAction("share")}
          aria-label="Share calculator result as image"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          Share image
        </Button>
      </div>
      <p
        className={
          error
            ? "text-center text-[11px] text-red-600"
            : "text-center text-[11px] text-neutral-500"
        }
        role={error ? "alert" : "status"}
      >
        {message ||
          (!ready
            ? "Preparing your result image…"
            : "Save a picture of your estimate or share it with your apps.")}
      </p>
      {error && !ready && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto w-full p-0 text-xs"
          onClick={() => setRetry((value) => value + 1)}
        >
          Retry image
        </Button>
      )}
    </div>
  );
}
