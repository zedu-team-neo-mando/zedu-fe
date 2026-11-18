import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { GetRequest } from "~/utils/new-request";
import { prefetchAvatars } from "~/utils/prefetch-avatars";

const UseChannel = () => {
  const params = useParams();
  const id = params.id as string;
  const { state, dispatch } = useContext(DataContext);
  const token = localStorage.getItem("token") || "";
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async (newPage: number = 1) => {
    try {
      const res = await GetRequest(
        `/threads/channels/${id}?page=${newPage}&limit=40`
      );

      if (res?.status === 200 || res?.status === 201) {
        const newThreads = Array.isArray(res.data?.data) ? res.data?.data : [];

        dispatch({
          type: ACTIONS.MESSAGES,
          payload: { newThreads, newPage },
        });

        prefetchAvatars(newThreads);

        // Set hasMore true only if messages exceed 40 and user scrolls
        if (newPage > 1 && newThreads.length > 0) {
          setHasMore(true);
        } else {
          setHasMore(newThreads.length >= 40);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching threads:", error);
      setHasMore(false);
    } finally {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (id && token) {
      const isInitialLoad =
        !Array.isArray(state?.messages) || state.messages.length === 0;
      if (isInitialLoad) {
        setLoading(true);
      }
      setHasMore(true);
      setPage(1);
      fetchThreads(1).finally(() =>
        dispatch({ type: ACTIONS.MESSAGE_LOADING, payload: false })
      );
    }
  }, [id, token, state?.countCallback]);

  const fetchMoreData = () => {
    if (hasMore) {
      const nextPage = page + 1;
      fetchThreads(nextPage);
    }
  };

  return {
    fetchMoreData,
    hasMore,
    loading,
  };
};

export default UseChannel;
