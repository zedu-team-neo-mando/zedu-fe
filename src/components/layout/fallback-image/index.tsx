"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import images from "~/assets/images";

interface FallbackImageProps {
  src?: string | StaticImageData;
  defaultAvatarUrl?: string | StaticImageData;
  alt?: string;
  userType?: "user" | "bot" | string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
}

export default function FallbackImage({
  src,
  defaultAvatarUrl,
  alt = "avatar",
  userType = "user",
  width = 36,
  height = 36,
  className = "rounded-[7px] border object-cover",
  priority = false,
  loading,
}: FallbackImageProps) {
  const fallbackUser = images.user;
  const fallbackBot = images.bot;

  const lastResortFallback =
    userType === "user" || userType === "" ? fallbackUser : fallbackBot;

  // Images that failed to load, so a dead avatar link falls back to the next option.
  const [failedSrcs, setFailedSrcs] = useState<string[]>([]);
  const srcKey = (value: string | StaticImageData) =>
    typeof value === "string" ? value : value.src;

  const imageSrc =
    [src, defaultAvatarUrl]
      .filter((value): value is string | StaticImageData => Boolean(value))
      .find((value) => !failedSrcs.includes(srcKey(value))) ||
    lastResortFallback;
  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");

  return (
    <Image
      onError={() => {
        const failed = srcKey(imageSrc);
        if (!failedSrcs.includes(failed)) {
          setFailedSrcs((prev) => [...prev, failed]);
        }
      }}
      src={imageSrc || images?.user}
      alt={alt || "avatar"}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={resolvedLoading}
      decoding="async"
    />
  );
}
