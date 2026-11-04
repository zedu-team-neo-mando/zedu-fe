import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { GetRequest } from "~/utils/new-request";
import { prefetchAvatars } from "~/utils/prefetch-avatars";

type ChannelRequest = {
  id: string;
  token: string;
  page: number;
  pending: boolean;
  hasMore: boolean;
  active: boolean;
};

const UseChannel = () => {
  const params = useParams();
  const id = params.id as string;
  const { state, dispatch } = useContext(DataContext);
  const token = localStorage.getItem("token") || "";
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const requestRef = useRef<ChannelRequest | null>(null);

  const fetchThreads = useCallback(
    async (request: ChannelRequest, newPage: number) => {
      if (!request.active || request.pending) return;
      request.pending = true;

      try {
        const res = await GetRequest(
          `/threads/channels/${request.id}?page=${newPage}&limit=40`
        );
        // Cleanup invalidates this request on channel, session or refresh changes.
        if (!request.active || requestRef.current !== request) return;

        if (res?.status === 200 || res?.status === 201) {
          const newThreads = Array.isArray(res.data?.data) ? res.data.data : [];

          dispatch({
            type: ACTIONS.MESSAGES,
            payload: { newThreads, newPage },
          });
          prefetchAvatars(newThreads);

          request.page = newPage;
          request.hasMore = newThreads.length >= 40;
        } else {
          request.hasMore = false;
        }
        setHasMore(request.hasMore);
      } catch (error) {
        if (request.active && requestRef.current === request) {
          console.error("Error fetching threads:", error);
          request.hasMore = false;
          setHasMore(false);
        }
      } finally {
        if (request.active && requestRef.current === request) {
          request.pending = false;
          setLoading(false);
          dispatch({ type: ACTIONS.MESSAGE_LOADING, payload: false });
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const previous = requestRef.current;
    const channelChanged = previous?.id !== id || previous?.token !== token;
    const request: ChannelRequest = {
      id,
      token,
      page: 1,
      pending: false,
      hasMore: true,
      active: true,
    };
    requestRef.current = request;

    // Do not show the previous conversation while the next one is loading.
    if (channelChanged) {
      dispatch({
        type: ACTIONS.MESSAGES,
        payload: { newThreads: [], newPage: 1 },
      });
    }

    if (id && token) {
      if (channelChanged) setLoading(true);
      setHasMore(true);
      void fetchThreads(request, 1);
    } else {
      request.hasMore = false;
      setHasMore(false);
      setLoading(false);
    }

    return () => {
      request.active = false;
    };
  }, [id, token, state?.countCallback, dispatch, fetchThreads]);

  const fetchMoreData = () => {
    const request = requestRef.current;
    if (request?.id === id && request.token === token && request.hasMore) {
      void fetchThreads(request, request.page + 1);
    }
  };

  return {
    fetchMoreData,
    hasMore,
    loading,
  };
};

export default UseChannel;
