"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

import { cn } from "~/lib/utils";

interface QRCodeDisplayProps {
  // An absolute URL, or a path that is resolved against the current origin.
  url: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay = ({
  url,
  size = 80,
  className = "",
}: QRCodeDisplayProps) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const dimension = `${size}px`;

  useEffect(() => {
    if (!url) return;

    setHasError(false);
    QRCode.toDataURL(new URL(url, window.location.origin).toString(), {
      width: size * 3,
      margin: 4,
      color: {
        dark: "#18181B",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((res) => setDataUrl(res))
      .catch((err) => {
        console.error("QR Code Generation Error:", err);
        setHasError(true);
      });
  }, [url, size]);

  // Without a URL there is nothing to encode, so don't leave a loading box.
  if (!url) return null;

  if (hasError) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: dimension, height: dimension }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-center text-xs text-neutral-500 hover:text-neutral-900 hover:underline",
          className
        )}
      >
        Link
      </a>
    );
  }

  if (!dataUrl) {
    return (
      <div
        role="status"
        aria-label="Loading QR code"
        style={{ width: dimension, height: dimension }}
        className={cn(
          "shrink-0 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100",
          className
        )}
      />
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white p-1",
        className
      )}
    >
      <Image
        src={dataUrl}
        alt="Scan QR code to download the Zedu app"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        unoptimized
      />
    </div>
  );
};
