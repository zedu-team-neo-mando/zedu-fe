import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { GetRequest } from "~/utils/new-request";

interface Props {
  /** Failed status (undefined when there was no response), or null on success. */
  onError?: (status: number | undefined | null) => void;
}

const UseGetSingleChannel = ({ onError }: Props = {}) => {
  const params = useParams();
  const id = params.id as string;
  const { state, dispatch } = useContext(DataContext);

  // get persisted data
  useEffect(() => {
    dispatch({
      type: ACTIONS.CHANNEL_READY,
      payload: true,
    });

    if (id) {
      const fetchChannelById = async () => {
        const res = await GetRequest(`/channels/${id}`);
        const status = res?.response?.status ?? res?.status;
        if (status === 200 || status === 201) {
          onError?.(null);
          const channel = res?.data?.data;
          dispatch({
            type: ACTIONS.CHANNEL_DETAILS,
            payload: channel,
          });
          if (channel?.name) {
            localStorage.setItem("channelName", channel.name);
            dispatch({
              type: ACTIONS.CHANNEL_NAME,
              payload: channel.name,
            });
          }
        } else if (status !== 401) {
          // 401 is handled by the session-expiry flow. Otherwise drop the
          // previous channel's details and name so nothing (composer label,
          // search chip, header) keeps pointing at it.
          localStorage.removeItem("channelName");
          dispatch({ type: ACTIONS.CHANNEL_DETAILS, payload: null });
          dispatch({ type: ACTIONS.CHANNEL_NAME, payload: "" });
          onError?.(status);
        }
        dispatch({
          type: ACTIONS.CHANNEL_READY,
          payload: false,
        });
      };
      fetchChannelById();
    }
  }, [
    dispatch,
    id,
    onError,
    // state?.channelCallback,
    state?.leaveCallback,
    state?.joinCallback,
  ]);

  return <></>;
};

export default UseGetSingleChannel;
