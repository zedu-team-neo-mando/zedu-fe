export type AvatarSource = {
  id?: string | number | null;
  user_id?: string | number | null;
  avatar_url?: string | null;
  default_avatar_url?: string | null;
};

const EMPTY_LOOKUP: ReadonlyMap<string, string> = new Map();

const lookupCache = new WeakMap<object, Map<string, string>>();

const toKey = (value: string | number | null | undefined): string | null => {
  if (value === undefined || value === null || value === "") return null;
  return String(value);
};

/**
 * Builds a `userId -> default_avatar_url` lookup from a member list.
 * The lookup is cached per members array so callers can call this on every
 * render without rebuilding it.
 */
export function getDefaultAvatarLookup(
  members: readonly AvatarSource[] | null | undefined
): ReadonlyMap<string, string> {
  if (!Array.isArray(members) || members.length === 0) return EMPTY_LOOKUP;

  const cacheKey = members as object;
  const cached = lookupCache.get(cacheKey);
  if (cached) return cached;

  const lookup = new Map<string, string>();

  for (const member of members) {
    const url = member?.default_avatar_url;
    if (!url) continue;

    for (const candidate of [member?.user_id, member?.id]) {
      const key = toKey(candidate);
      if (key && !lookup.has(key)) lookup.set(key, url);
    }
  }

  lookupCache.set(cacheKey, lookup);
  return lookup;
}

/**
 * Resolves the default avatar for an entry without overriding its own value.
 * Order: the entry's own `default_avatar_url`, then the provided lookup.
 */
export function resolveDefaultAvatar(
  entry: AvatarSource | null | undefined,
  lookup?: ReadonlyMap<string, string> | null
): string | undefined {
  if (!entry) return undefined;
  if (entry.default_avatar_url) return entry.default_avatar_url;
  if (!lookup) return undefined;

  for (const candidate of [entry.user_id, entry.id]) {
    const key = toKey(candidate);
    if (!key) continue;
    const url = lookup.get(key);
    if (url) return url;
  }

  return undefined;
}

/**
 * Returns the entry with `default_avatar_url` filled from the lookup when it
 * is missing. `avatar_url` is never touched. Returns the same entry when
 * nothing can be resolved.
 */
export function withResolvedDefaultAvatar<T extends AvatarSource>(
  entry: T,
  lookup?: ReadonlyMap<string, string> | null
): T {
  if (!entry || entry.default_avatar_url) return entry;
  const resolved = resolveDefaultAvatar(entry, lookup);
  return resolved ? { ...entry, default_avatar_url: resolved } : entry;
}
