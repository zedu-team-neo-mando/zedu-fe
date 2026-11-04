import { useState } from "react";
import { GetRequest } from "~/utils/new-request";
import type { ChannelLookup } from "~/utils/org-switch";

const useFirstChannel = () => {
  const [channelsId, setChannelsId] = useState("");

  // Function to fetch the first channel
  const firstChannel: ChannelLookup = async (orgId, options) => {
    if (!orgId) return null;

    const res = await GetRequest(`/organisations/${orgId}/user-channels`);

    // The switch that asked for this channel already stopped waiting, so the
    // user has moved on. Writing here would carry this channel into whichever
    // workspace they moved to.
    if (options?.isAbandoned?.()) return null;

    if (res?.status === 200 || res?.status === 201) {
      const channel = res?.data?.data[0];
      if (channel) {
        localStorage.setItem("channelId", channel.channels_id);
        localStorage.setItem("channelName", channel.name);
        setChannelsId(channel.channels_id);
      }
    }

    return res?.data?.data[0]?.channels_id;
  };

  return { firstChannel, channelsId };
};

export default useFirstChannel;
