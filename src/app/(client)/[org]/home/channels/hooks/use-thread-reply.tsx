import { useContext, useEffect, useState } from "react";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { GetRequest } from "~/utils/new-request";
import { prefetchAvatars } from "~/utils/prefetch-avatars";

const UseThreadReply = (onRead?: () => void) => {
  const { state, dispatch } = useContext(DataContext);
  const channelId = state?.thread?.channels_id;
  const threadId = state?.thread?.thread_id;
  const token = localStorage.getItem("token") || "";
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchReplies = async (newPage = 1) => {
    if (!channelId || !threadId) return;

    try {
      const res = await GetRequest(
        `/threads/${threadId}/channels/${channelId}?page=${newPage}&limit=30`
      );

      if (res?.status === 200 || res?.status === 201) {
        const newThreads = Array.isArray(res.data?.data) ? res.data.data : [];

        dispatch({
          type: ACTIONS.REPLIES,
          payload: {
            newThreads,
            newPage,
            parentReactions: state?.thread?.reactions,
          },
        });

        if (newPage === 1 && state?.reply) {
          onRead?.();
        }

        prefetchAvatars(newThreads);

        setHasMore(newThreads.length >= 30);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching thread replies:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (threadId && channelId && token) {
      setLoading(true);
      fetchReplies(1).finally(() =>
        dispatch({ type: ACTIONS.MESSAGE_LOADING, payload: false })
      );
    }
  }, [state?.reply, threadId, channelId, token, dispatch, onRead]);

  const fetchMoreData = () => {
    if (hasMore && !loading) {
      fetchReplies(page + 1);
    }
  };

  return {
    fetchMoreData,
    hasMore,
    loading,
  };
};

export default UseThreadReply;
