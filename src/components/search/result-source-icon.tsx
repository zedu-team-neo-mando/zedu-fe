import { Hash, Lock, User, Users } from "lucide-react";
import type { SearchResultSourceKind } from "~/lib/search/result-source";

const ICONS = {
  channel: Hash,
  private: Lock,
  dm: User,
  group: Users,
} as const;

/** The icon for where a search result came from: #, lock, person or people. */
export const ResultSourceIcon = ({
  kind,
  size = 12,
  className,
}: {
  kind: SearchResultSourceKind;
  size?: number;
  className?: string;
}) => {
  const Icon = ICONS[kind];
  return <Icon size={size} className={className} aria-hidden="true" />;
};
