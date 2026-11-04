"use client";

import { useCallback, useContext, useRef } from "react";
import { ThreadList } from "../_components/threads/thread-lists";
import ThreadsSidebar, {
  getThreadsSidebarLayoutWidth,
  threadsSidebarPanelClassName,
} from "../_components/threads-sidebar";
import { DataContext } from "~/store/GlobalState";
import { PostRequest } from "~/utils/new-request";
import UseThreadReply from "../home/channels/hooks/use-thread-reply";
import HoverSidebar from "../_components/profile-sidebar/hover-sidebar";
import { ACTIONS } from "~/store/Actions";
import { useIsSmUp, useMediaQuery } from "~/hooks/use-media-query";
import { cn } from "~/lib/utils";
import { loadOrganisationThreadsPage } from "~/utils/org-threads";

const Threads = () => {
  const { state, dispatch } = useContext(DataContext);
  const { thread, loadThread } = state;
  const isSmUp = useIsSmUp();
  const isDesktopWidth = useMediaQuery("(min-width: 1024px)");
  const refreshRequestId = useRef(0);
  const unseenThreadCountRevisionRef = useRef(
    state?.unseenThreadCountRevision ?? 0
  );
  unseenThreadCountRevisionRef.current = state?.unseenThreadCountRevision ?? 0;

  const refreshUnseenThreadCount = useCallback(async () => {
    const orgId = state?.orgId || localStorage.getItem("orgId") || "";
    if (!orgId) return;

    const requestId = ++refreshRequestId.current;
    const expectedRevision = unseenThreadCountRevisionRef.current;
    const { success, unseenThreadCount } = await loadOrganisationThreadsPage(
      orgId,
      1
    );

    if (success && requestId === refreshRequestId.current) {
      dispatch({
        type: ACTIONS.SYNC_UNSEEN_THREAD_COUNT,
        payload: { unseenThreadCount, expectedRevision },
      });
    }
  }, [dispatch, state?.orgId]);

  const { fetchMoreData, hasMore } = UseThreadReply(
    isDesktopWidth ? refreshUnseenThreadCount : undefined
  );

  const handleReplyMessage = async (
    id: string,
    _uuid: string,
    content: string,
    medias: unknown,
    mentions: any = state?.mentions
  ) => {
    const channelId = state?.thread?.channels_id || id;
    const payload = {
      content,
      channels_id: channelId,
      user_id: state?.user?.id,
      thread_id: state?.thread?.thread_id,
      media: medias,
      mentions: mentions,
    };

    let res;
    if (thread?.channel_type === "DM") {
      res = await PostRequest(`/dms/messages/${channelId}`, payload);
    } else if (thread?.channel_type === "GroupDm") {
      res = await PostRequest(`/group-dms/messages/${channelId}`, payload);
    } else {
      res = await PostRequest(`/channels/${channelId}/messages`, payload);
    }
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.LOAD_THREAD, payload: !loadThread });
    }
    return res?.status === 200 || res?.status === 201;
  };

  let sidePanelWidth = 0;
  if (state?.hoverProfile) sidePanelWidth += isSmUp ? 408 : 0;
  if (state?.reply) {
    sidePanelWidth += getThreadsSidebarLayoutWidth(true, isSmUp);
  }

  return (
    <div className="relative flex h-[calc(100dvh-70px)] w-full overflow-hidden">
      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden transition-[margin] duration-300 ease-in-out"
        style={{ marginRight: `${sidePanelWidth}px` }}
      >
        <ThreadList />
      </div>

      <div
        className={cn(
          "fixed z-30 right-0 top-0 mt-[60px] flex h-full transition-all duration-300 ease-in-out",
          !isSmUp && state?.reply && "w-full"
        )}
        style={
          !isSmUp && state?.reply ? undefined : { width: `${sidePanelWidth}px` }
        }
      >
        {state?.hoverProfile && isSmUp && (
          <div className="h-full w-[408px] border-l border-[#E6EAEF] bg-white">
            <HoverSidebar />
          </div>
        )}

        {state?.reply && (
          <div className={threadsSidebarPanelClassName}>
            <ThreadsSidebar
              handleSendMessage={handleReplyMessage}
              fetchMoreData={fetchMoreData}
              hasMore={hasMore}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Threads;
