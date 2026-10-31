import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { GetRequest } from "~/utils/new-request";

const LIMIT = 50;

export const useOrganisationDms = (orgId: string) => {
  const { state, dispatch } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [failedPage, setFailedPage] = useState<number | null>(null);
  const loadingRef = useRef(false);
  const requestGeneration = useRef(0);
  // Keep a ref so appends always use the latest list (avoids stale closure).
  const dmsRef = useRef(state.dms);
  dmsRef.current = state.dms;

  const fetchDms = useCallback(
    async (pageNumber: number, isInitial: boolean) => {
      if (!orgId || loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setFailedPage(null);
      const generation = requestGeneration.current;
      try {
        const response = await GetRequest(
          `/organisations/${orgId}/dms?page=${pageNumber}&limit=${LIMIT}`
        );
        if (generation !== requestGeneration.current) return;

        if (response?.status === 200 || response?.status === 201) {
          const newDms = response?.data?.data || [];
          const pagination = response?.data?.pagination?.[0];

          dispatch({
            type: ACTIONS.DMS,
            payload: isInitial
              ? newDms
              : [...(dmsRef.current || []), ...newDms],
          });

          setPage(pageNumber);
          setHasMore(
            pagination
              ? pagination.current_page < pagination.total_pages
              : newDms.length >= LIMIT
          );
        } else {
          setFailedPage(pageNumber);
        }
      } catch {
        if (generation === requestGeneration.current) setFailedPage(pageNumber);
      } finally {
        if (generation === requestGeneration.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    [orgId, dispatch]
  );

  useEffect(() => {
    if (!orgId) return;
    requestGeneration.current += 1;
    loadingRef.current = false;
    setPage(1);
    setHasMore(true);
    fetchDms(1, true);
    return () => {
      requestGeneration.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orgId,
    state?.groupCallback,
    state?.dmCount,
    state?.dmRenderCallback,
    state?.deleteCallback,
  ]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && failedPage === null) {
      fetchDms(page + 1, false);
    }
  }, [loading, hasMore, failedPage, page, fetchDms]);

  const retry = useCallback(() => {
    if (failedPage !== null) fetchDms(failedPage, failedPage === 1);
  }, [failedPage, fetchDms]);

  return { loading, hasMore, loadMore, failedPage, retry };
};
