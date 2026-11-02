import { useContext, useEffect } from "react";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { GetRequest } from "~/utils/new-request";
import { loadOrganisationThreadsPage } from "~/utils/org-threads";

const UseHomeChannel = () => {
  const { state, dispatch } = useContext(DataContext);
  const orgId = localStorage.getItem("orgId") || "";

  useEffect(() => {
    if (!orgId) return;
    dispatch({ type: ACTIONS.CHANNELS, payload: null });
    dispatch({ type: ACTIONS.HOME_DMS, payload: null });
    dispatch({ type: ACTIONS.THREAD_MENTIONS, payload: { reset: true } });
    dispatch({ type: ACTIONS.CHANNEL_LOADING, payload: true });
  }, [orgId, dispatch]);

  // fetch all user channels
  useEffect(() => {
    if (orgId && state?.token) {
      let ignore = false;
      const fetchChannels = async () => {
        const res = await GetRequest(`/organisations/${orgId}/user-channels`);
        const data = res?.data?.data;

        if (!ignore && (res?.status === 200 || res?.status === 201)) {
          dispatch({ type: ACTIONS.CHANNELS, payload: data ?? [] });
        }

        if (!ignore) {
          dispatch({
            type: ACTIONS.CHANNEL_LOADING,
            payload: false,
          });
        }
      };

      fetchChannels();
      return () => {
        ignore = true;
      };
    }
  }, [
    orgId,
    state?.channelCallback,
    dispatch,
    state?.joinCallback,
    state?.leaveCallback,
  ]);

  // FETCH ALL CHANNELS
  useEffect(() => {
    if (orgId && state?.token) {
      let ignore = false;
      const fetchAllChannels = async () => {
        const res = await GetRequest(
          `/organisations/${orgId}/channels?limit=200`
        );

        if (!ignore && (res?.status === 200 || res?.status === 201)) {
          dispatch({ type: ACTIONS.ALL_CHANNELS, payload: res?.data?.data });
        }
      };

      dispatch({
        type: ACTIONS.CHANNEL_LOADING,
        payload: !Array.isArray(state?.channels) || state.channels.length === 0,
      });

      fetchAllChannels();
      return () => {
        ignore = true;
      };
    }
  }, [orgId, dispatch, state?.channelCallback]);

  useEffect(() => {
    if (orgId) {
      const fetchChannels = async () => {
        const res = await GetRequest(
          `/organisations/${orgId}/dms?page=1&limit=50`
        );

        if (res?.status === 200 || res?.status === 201) {
          dispatch({ type: ACTIONS.DMS, payload: res?.data?.data });
        }
      };
      fetchChannels();
    }
  }, [orgId, dispatch]);

  // visibility dms
  useEffect(() => {
    if (!orgId) return;

    const fetchVisibleDms = async () => {
      const res = await GetRequest(
        `/organisations/${orgId}/dms/visible?page=1&limit=100`
      );

      if (res?.status === 200 || res?.status === 201) {
        dispatch({
          type: ACTIONS.HOME_DMS,
          payload: res?.data?.data ?? [],
        });
      }
    };

    fetchVisibleDms();
  }, [
    orgId,
    dispatch,
    state?.triggerCallback,
    state?.createCallback,
    state?.homeDmsCallback,
  ]);

  useEffect(() => {
    if (!orgId || !state?.token) return;

    const fetchSidebarThreads = async () => {
      const { success, threads, hasMore, unseenThreadCount } =
        await loadOrganisationThreadsPage(orgId, 1);

      dispatch({
        type: ACTIONS.THREAD_MENTIONS,
        payload: {
          newThreads: success ? threads : [],
          newPage: 1,
          hasMore,
          unseenThreadCount: success ? unseenThreadCount : 0,
        },
      });
    };

    void fetchSidebarThreads();
  }, [orgId, state?.token, dispatch]);

  // useEffect(() => {
  //   if (orgId) {
  //     const fetchBots = async () => {
  //       const res = await GetRequest(`/organisations/${orgId}/fetch-bots`);

  //       if (res?.status === 200 || res?.status === 201) {
  //         dispatch({ type: ACTIONS.AGENT_DM, payload: res?.data?.data });
  //       }
  //     };
  //     fetchBots();
  //   }
  // }, [orgId, dispatch, state?.agentCallback]);

  return <></>;
};

export default UseHomeChannel;
