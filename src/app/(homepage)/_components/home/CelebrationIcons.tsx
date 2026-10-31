import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

/** Real Nigerian Flag tricolor vector (Green-White-Green) */
export const NigerianFlagIcon: React.FC<IconProps> = ({
  className = "h-4 w-6",
}) => (
  <span
    className={`inline-block overflow-hidden rounded-[3px] border border-black/15 shadow-sm align-middle ${className}`}
    style={{ aspectRatio: "3 / 2" }}
    role="img"
    aria-label="Flag of Nigeria"
  >
    <svg viewBox="0 0 36 24" className="w-full h-full block">
      <rect x="0" y="0" width="12" height="24" fill="#008751" />
      <rect x="12" y="0" width="12" height="24" fill="#FFFFFF" />
      <rect x="24" y="0" width="12" height="24" fill="#008751" />
    </svg>
  </span>
);

/** Majestic Eagle icon (symbol of strength on Nigerian coat of arms) */
export const EagleIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Eagle"
  >
    <path d="M12 2C10.5 4 8.5 5 7 5.5C5 6.2 3.5 7.5 2 9.5C4 9.2 6.5 9 8 9.5C5.5 11 3.5 13 2 15C4.5 14.5 7.5 14 9.5 15C8 16.5 6 18 4 19.5C6.5 19 9.5 18 11.5 18.5C11.8 20 12.2 21.5 12.5 22C12.8 21.5 13.2 20 13.5 18.5C15.5 18 18.5 19 21 19.5C19 18 17 16.5 15.5 15C17.5 14 20.5 14.5 23 15C21.5 13 19.5 11 17 9.5C18.5 9 21 9.2 23 9.5C21.5 7.5 20 6.2 18 5.5C16.5 5 14.5 4 13 2H12Z" />
  </svg>
);

/** Delicious Nigerian Jollof Rice bowl vector */
export const JollofRiceIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Jollof Rice"
  >
    {/* Bowl base */}
    <path
      d="M4 16C4 23.732 10.268 28 16 28C21.732 28 28 23.732 28 16H4Z"
      fill="#D97706"
    />
    <path
      d="M3 16C3 15.4477 3.44772 15 4 15H28C28.5523 15 29 15.4477 29 16C29 16.5523 28.5523 17 28 17H4C3.44772 17 3 16.5523 3 16Z"
      fill="#B45309"
    />
    {/* Steaming savory jollof rice mound */}
    <path d="M6 15C6 11.5 10 7 16 7C22 7 26 11.5 26 15H6Z" fill="#DC2626" />
    {/* Garnishes / seasoned grains */}
    <circle cx="12" cy="11" r="1.5" fill="#F59E0B" />
    <circle cx="17" cy="10" r="1.2" fill="#10B981" />
    <circle cx="21" cy="12" r="1.4" fill="#FBBF24" />
    <circle cx="14" cy="13" r="1.2" fill="#FEF08A" />
    {/* Steam wisps */}
    <path
      d="M13 5C13 3.5 14 3 14 2M18 5C18 3.5 19 3 19 2"
      stroke="#F59E0B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/** Traditional Talking Drum vector */
export const TalkingDrumIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Talking Drum"
  >
    <path
      d="M7 4C7 3 9.2 2 12 2C14.8 2 17 3 17 4V6C15 9 15 15 17 18V20C17 21 14.8 22 12 22C9.2 22 7 21 7 20V18C9 15 9 9 7 6V4Z"
      fill="#92400E"
    />
    <path
      d="M7 4C7 5 9.2 6 12 6C14.8 6 17 5 17 4"
      stroke="#FBBF24"
      strokeWidth="1.2"
    />
    {/* Tension cords */}
    <path d="M8 5L16 19M16 5L8 19" stroke="#FDE68A" strokeWidth="1" />
    <path d="M12 5V19" stroke="#FDE68A" strokeWidth="1" />
  </svg>
);

/** Green Heart vector */
export const GreenHeartIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="#008751"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Green Heart"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

/** Festive Christmas Tree SVG */
export const ChristmasTreeIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Christmas Tree"
  >
    <polygon
      points="12,2 14,6 18,6 15,9 16,13 12,11 8,13 9,9 6,6 10,6"
      fill="#FBBF24"
    />
    <path d="M12 5L7 11H10L5 17H19L14 11H17L12 5Z" fill="#059669" />
    <circle cx="10" cy="14" r="1.2" fill="#EF4444" />
    <circle cx="14" cy="14" r="1.2" fill="#F59E0B" />
    <circle cx="12" cy="9" r="1.2" fill="#3B82F6" />
    <rect x="11" y="17" width="2" height="4" fill="#78350F" />
  </svg>
);

/** Detailed Snowflake SVG */
export const SnowflakeIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Snowflake"
  >
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14M9 3l3 3 3-3M3 9l3 3-3 3M9 21l3-3 3 3M21 9l-3 3 3 3" />
  </svg>
);

/** Festive Gift Box SVG */
export const GiftBoxIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Gift Box"
  >
    <rect x="3" y="10" width="18" height="11" rx="2" fill="#DC2626" />
    <rect x="2" y="7" width="20" height="4" rx="1.5" fill="#EF4444" />
    <rect x="10.5" y="7" width="3" height="14" fill="#FBBF24" />
    <path
      d="M12 7C10.5 4.5 7.5 4.5 7.5 6C7.5 7.5 12 7 12 7ZM12 7C13.5 4.5 16.5 4.5 16.5 6C16.5 7.5 12 7 12 7Z"
      fill="#FBBF24"
    />
  </svg>
);

/** Easter Egg SVG */
export const EasterEggIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Easter Egg"
  >
    <path
      d="M12 2C7 2 4 8 4 14C4 18.5 7.5 22 12 22C16.5 22 20 18.5 20 14C20 8 17 2 12 2Z"
      fill="#F59E0B"
    />
    <path
      d="M5 12L8 10L12 12L16 10L19 12"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 16L8 14L12 16L16 14L19 16"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="7" r="1.5" fill="#EC4899" />
    <circle cx="16" cy="7" r="1.5" fill="#EC4899" />
  </svg>
);

/** New Year Champagne Toast SVG */
export const ChampagneToastIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className}`}
    role="img"
    aria-label="Champagne Toast"
  >
    <path
      d="M7 3L10 9C10.5 10 10 11 9 11H5C4 11 3.5 10 4 9L7 3Z"
      fill="#FDE68A"
      stroke="#D97706"
      strokeWidth="1.2"
    />
    <path
      d="M7 11V18M4 18H10"
      stroke="#D97706"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17 3L20 9C20.5 10 20 11 19 11H15C14 11 13.5 10 14 9L17 3Z"
      fill="#FDE68A"
      stroke="#D97706"
      strokeWidth="1.2"
    />
    <path
      d="M17 11V18M14 18H20"
      stroke="#D97706"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="4" r="1" fill="#F59E0B" />
    <circle cx="11" cy="7" r="1.2" fill="#FBBF24" />
    <circle cx="13" cy="8" r="1" fill="#FBBF24" />
  </svg>
);
