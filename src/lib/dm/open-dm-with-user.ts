import type { Dispatch } from "react";
import { ACTIONS } from "~/store/Actions";
import { PostRequest } from "~/utils/new-request";
import { showError } from "~/components/toast/sonner";

type DmUserLike = {
  user_id?: string | null;
  id?: string | null;
  username?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  profile_url?: string | null;
  default_avatar_url?: string | null;
  is_deactivated?: boolean | string;
  is_restricted?: boolean | string;
};

type OpenDmArgs = {
  user: DmUserLike;
  orgId?: string | null;
  orgSlug?: string | null;
  router: { push: (href: string) => void };
  dispatch: Dispatch<{ type: string; payload?: unknown }>;
};

const getParticipantId = (user: DmUserLike) => user.user_id ?? user.id ?? "";

/**
 * The DM route renders its header from `state.participant`, so the store has to
 * be told who we are opening before navigating. Without this the previous
 * conversation's participant wins the `previewParticipant || participant` check
 * and the DM renders with the wrong name and avatar.
 */
const toPreviewParticipant = (user: DmUserLike, userId: string) => ({
  user_id: userId,
  username: user.username || user.name || "",
  avatar_url: user.profile_url || user.avatar_url || undefined,
  default_avatar_url: user.default_avatar_url || undefined,
  is_deactivated: user.is_deactivated,
  is_restricted: user.is_restricted,
});

/**
 * Open (or create) the 1:1 DM with a user and route to it.
 * Returns true when the conversation was opened.
 */
export async function openDmWithUser({
  user,
  orgId,
  orgSlug,
  router,
  dispatch,
}: OpenDmArgs): Promise<boolean> {
  const participantId = getParticipantId(user);

  if (!orgId) {
    showError("Couldn't open the conversation", "Missing organisation id.");
    return false;
  }

  if (!orgSlug) {
    showError("Couldn't open the conversation", "Missing organisation.");
    return false;
  }

  if (!participantId) {
    showError("Couldn't open the conversation", "This user can't be messaged.");
    return false;
  }

  try {
    const response = await PostRequest(`/organisations/${orgId}/dms`, {
      chat_type: "user",
      participant_id: participantId,
    });

    if (response?.status !== 200 && response?.status !== 201) {
      showError("Couldn't open the conversation");
      return false;
    }

    const channelId = response?.data?.data?.channel_id;
    const channelParticipantId =
      response?.data?.data?.participant_id || participantId;

    if (!channelId) {
      showError("Couldn't open the conversation");
      return false;
    }

    dispatch({
      type: ACTIONS.PARTICIPANT,
      payload: toPreviewParticipant(user, channelParticipantId),
    });

    router.push(
      `/${orgSlug}/home/people/${channelId}/${channelParticipantId}/dm`
    );

    return true;
  } catch (error) {
    console.error("Failed to open DM:", error);
    showError("Couldn't open the conversation");
    return false;
  }
}
