export const reloadCurrentPath = () => {
  if (typeof window === "undefined") return;

  window.location.replace(
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  );
};

export const redirectAfterOrgSwitch = (
  orgSlug: string,
  channelId?: string | null,
  options?: { preservePath?: boolean }
) => {
  if (options?.preservePath) {
    reloadCurrentPath();
    return;
  }

  const target = channelId
    ? `/${orgSlug}/home/channels/${channelId}`
    : `/${orgSlug}`;

  window.location.replace(target);
};

export type ChannelLookup = (
  orgId?: string,
  options?: { isAbandoned?: () => boolean }
) => Promise<string | null | undefined>;

/**
 * Picks the channel to land on after an organisation switch, giving up after
 * `timeoutMs` so a slow lookup cannot block the redirect.
 *
 * Giving up is not the same as cancelling: the lookup keeps running, and it
 * writes the channel it eventually finds into local storage. That write used
 * to happen after the caller had already navigated, seeding the next
 * workspace with a channel id from the previous one. The in-flight lookup is
 * therefore told when it has been abandoned, so it can drop its side effects.
 */
export const resolveChannelIdForOrgSwitch = async (
  fetchFirstChannel: ChannelLookup,
  orgId?: string,
  timeoutMs = 1000
): Promise<string | null> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abandoned = false;

  try {
    const timedOut = new Promise<null>((resolve) => {
      timer = setTimeout(() => {
        abandoned = true;
        resolve(null);
      }, timeoutMs);
    });

    const channelId = await Promise.race([
      fetchFirstChannel(orgId, { isAbandoned: () => abandoned }),
      timedOut,
    ]);

    return channelId ?? null;
  } catch {
    return null;
  } finally {
    // The winning branch leaves this pending; it must not fire after the
    // caller has moved on, and it must not keep the page alive.
    if (timer !== undefined) clearTimeout(timer);
  }
};
