"use client";

import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { GooglePlayStoreOutlineIcon, AppleStoreOutlineIcon } from "../svgs";

export const OutlineBtn = ({
  text,
  className,
  onClick,
  href,
}: {
  text: string;
  onClick?: () => void;
  className?: string;
  href?: string;
}) => {
  const button = (
    <button
      onClick={onClick}
      className={cn(
        "border border-primary-500 text-blue-100 ease-in px-4 py-2.5 sm:px-6 sm:py-3 font-medium rounded-full transition-colors duration-100 hover:bg-primary-500 hover:text-white",
        className
      )}
    >
      {text}
    </button>
  );

  if (href) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
};

export const ArrowBtn = ({
  text,
  className,
  onClick,
  href,
  linkToHome,
  inverted,
  loggedInText,
  hideArrow = false,
}: {
  text: string;
  onClick?: () => void;
  className?: string;
  href?: string;
  hideArrow?: boolean;
  linkToHome?: boolean;
  loggedInText?: string;
  inverted?: boolean;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
    setOrgSlug(window.localStorage.getItem("orgSlug"));
  }, []);

  if (linkToHome) href = token ? `/${orgSlug}` : "/auth/sign-up";

  return (
    <Link href={href || "#"}>
      <button
        onClick={onClick}
        className={cn(
          "group bg-primary-500 text-white px-4 py-2.5 sm:px-6 sm:py-3 font-medium rounded-full flex items-center gap-3 transition-colors duration-200 hover:bg-primary-400",
          className
        )}
      >
        {token && loggedInText ? loggedInText : text}
        {!hideArrow && (
          <div
            className={cn(
              "transition-transform duration-300 ease-out group-hover:translate-x-1",
              inverted && "order-first"
            )}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9964 9.5533 24.6256 6.24882 22.1884 3.81163C19.7512 1.37445 16.4467 0.00363977 13 0ZM18.7075 13.7075L14.7075 17.7075C14.5199 17.8951 14.2654 18.0006 14 18.0006C13.7346 18.0006 13.4801 17.8951 13.2925 17.7075C13.1049 17.5199 12.9994 17.2654 12.9994 17C12.9994 16.7346 13.1049 16.4801 13.2925 16.2925L15.5863 14H8.00001C7.73479 14 7.48044 13.8946 7.2929 13.7071C7.10536 13.5196 7.00001 13.2652 7.00001 13C7.00001 12.7348 7.10536 12.4804 7.2929 12.2929C7.48044 12.1054 7.73479 12 8.00001 12H15.5863L13.2925 9.7075C13.1049 9.51986 12.9994 9.26536 12.9994 9C12.9994 8.73464 13.1049 8.48014 13.2925 8.2925C13.4801 8.10486 13.7346 7.99944 14 7.99944C14.2654 7.99944 14.5199 8.10486 14.7075 8.2925L18.7075 12.2925C18.8005 12.3854 18.8742 12.4957 18.9246 12.6171C18.9749 12.7385 19.0008 12.8686 19.0008 13C19.0008 13.1314 18.9749 13.2615 18.9246 13.3829C18.8742 13.5043 18.8005 13.6146 18.7075 13.7075Z"
                fill="white"
              />
            </svg>
          </div>
        )}
      </button>
    </Link>
  );
};

export const DownloadAppBtn = ({
  text,
  description,
  className,
  onClick,
  href,
  leftIcon,
  iconColor,
  ariaLabel,
}: {
  text: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  href?: string;
  leftIcon?: "google" | "apple" | string;
  iconColor?: string;
  ariaLabel?: string;
  /** @deprecated Badges now share one style; prop kept so callers still compile. */
  dark?: boolean;
  /** @deprecated The arrow was removed; prop kept so callers still compile. */
  hideArrow?: boolean;
  /** @deprecated The arrow was removed; prop kept so callers still compile. */
  inverted?: boolean;
}) => {
  const iconMap: Record<string, (props?: { color?: string }) => JSX.Element> = {
    google: GooglePlayStoreOutlineIcon,
    apple: AppleStoreOutlineIcon,
  };

  const LeftIcon = iconMap[leftIcon as string] || GooglePlayStoreOutlineIcon;

  return (
    <Link
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label={ariaLabel ?? (description ? `${text} ${description}` : text)}
      className={cn(
        "flex h-16 w-[232px] items-center gap-3 rounded-xl border border-white/40 bg-[#0b0b0f] px-[22px] text-white",
        "transition duration-150 motion-reduce:transition-none",
        "hover:-translate-y-0.5 hover:border-white hover:shadow-lg",
        "active:translate-y-0 active:shadow-none",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-[30px] shrink-0 items-center justify-center [&_svg]:size-full"
      >
        <LeftIcon color={iconColor ?? "#FFFFFF"} />
      </span>
      <span className="flex flex-col whitespace-nowrap text-left leading-[1.15]">
        <span className="text-xs font-semibold tracking-wide">{text}</span>
        {description && (
          <span className="text-[22px] font-bold tracking-tight">
            {description}
          </span>
        )}
      </span>
    </Link>
  );
};
