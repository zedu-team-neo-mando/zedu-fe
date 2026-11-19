"use client";

import { HashIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { ACTIONS } from "~/store/Actions";
import { useContext } from "react";
import { DataContext } from "~/store/GlobalState";

interface ComponentProps {
  name: string;
  active: boolean;
  thread_count: number;
  channels_id: string;
  id?: string;
  archived?: boolean;
}

export const ChannelCardOthers = (props: ComponentProps) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { state, dispatch } = useContext(DataContext);
  const { orgSlug } = state;

  // Determine if this card is the currently selected one
  const isSelected = props.channels_id === id;

  // select channel
  const selectChannel = () => {
    dispatch({ type: ACTIONS.MESSAGE_LOADING, payload: true });
    // Keep the unread count of the channel being opened for the unread divider
    dispatch({
      type: ACTIONS.CHANNEL_UNREAD_COUNT,
      payload: props.thread_count || 0,
    });
    router.push(`/${orgSlug}/home/channels/${props.channels_id}`);
    localStorage.setItem("channelId", props?.channels_id);
    localStorage.setItem("channelName", props?.name);
  };

  //

  return (
    <li
      className={cn(
        "relative px-2 mx-2 py-[7px] flex items-center rounded-lg group hover:bg-blue-200 cursor-pointer",
        isSelected ? "bg-blue-200" : ""
      )}
      onClick={selectChannel}
    >
      <div className="flex-1 flex items-center gap-1">
        <HashIcon
          className={cn("size-4", props.active ? "text-white" : "text-blue-50")}
        />
        <p
          className={cn(
            "text-[15px] leading-4 lowercase truncate w-[180px]",
            props.active ? "font-semibold text-white" : "text-blue-50"
          )}
          title={props.name}
        >
          {props.name}
        </p>
      </div>
    </li>
  );
};
