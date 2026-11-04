"use client";

import { UserRoundX } from "lucide-react";
import { cn } from "~/lib/utils";
import FallbackImage from "~/components/layout/fallback-image";
import images from "~/assets/images";
import { isUserDeactivated } from "~/utils/user-deactivation";

const SIZE_MAP = {
  tiny: { px: 20, className: "size-5" },
  "2xs": { px: 24, className: "size-6" },
  xs: { px: 28, className: "size-7" },
  sm: { px: 36, className: "size-9" },
  md: { px: 40, className: "size-10" },
  sidebar: { px: 32, className: "size-8" },
  lg: { px: 56, className: "size-14" },
  intro: { px: 64, className: "size-16" },
  xl: { px: 80, className: "size-20" },
  "2xl": { px: 96, className: "size-24" },
  profile: { px: 250, className: "mx-auto size-[250px]" },
} as const;

export type UserAvatarSize = keyof typeof SIZE_MAP;

export type UserAvatarItem = {
  avatar_url?: string;
  default_avatar_url?: string;
  sender_avatar_url?: string;
  sender_default_avatar_url?: string;
  user_type?: string;
  is_deactivated?: boolean | string;
  sender_is_deactivated?: boolean | string;
  is_restricted?: boolean | string;
  participants?: UserAvatarItem[];
  participant?: UserAvatarItem;
  user?: UserAvatarItem;
};

interface UserAvatarProps {
  item?: UserAvatarItem | null;
  src?: string;
  defaultAvatarUrl?: string;
  userType?: string;
  alt?: string;
  size?: UserAvatarSize;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  isDeactivated?: boolean;
}

export default function UserAvatar({
  item,
  src,
  defaultAvatarUrl,
  userType,
  alt = "avatar",
  size = "sm",
  className,
  imageClassName,
  priority = false,
  isDeactivated,
}: UserAvatarProps) {
  const { px, className: sizeClass } = SIZE_MAP[size];
  const deactivated = isDeactivated ?? isUserDeactivated(item);
  const showAccountTag = deactivated && (size === "profile" || size === "xl");
  const compactTag = size !== "profile";

  const resolvedSrc = deactivated
    ? images.user
    : (src ?? item?.avatar_url ?? item?.sender_avatar_url);
  const resolvedDefault = deactivated
    ? images.user
    : (defaultAvatarUrl ??
      item?.default_avatar_url ??
      item?.sender_default_avatar_url);
  const resolvedUserType = userType ?? item?.user_type ?? "user";

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden", sizeClass, className)}
    >
      <FallbackImage
        src={resolvedSrc}
        defaultAvatarUrl={resolvedDefault}
        userType={resolvedUserType}
        alt={alt}
        width={px}
        height={px}
        priority={priority}
        className={cn(
          "h-full w-full rounded-[7px] border object-cover object-top",
          imageClassName
        )}
      />
      {showAccountTag && (
        <div
          className={cn(
            "absolute flex items-center justify-center font-medium text-white bg-[#1D1C1D]/70",
            compactTag
              ? "inset-x-1 bottom-1 rounded-[4px] px-1.5 py-1 text-[9px] leading-tight"
              : "inset-x-2.5 bottom-2.5 gap-2 rounded-md px-3 py-2 text-[13px]"
          )}
        >
          {!compactTag && (
            <UserRoundX className="size-4 shrink-0" strokeWidth={2} />
          )}
          {compactTag ? "Deactivated" : "Deactivated account"}
        </div>
      )}
    </div>
  );
}
