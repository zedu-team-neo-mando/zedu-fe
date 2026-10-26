"use client";

import { useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquare, Phone, Plus, Users } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { Button } from "~/components/ui/button";
import UserAvatar from "~/components/layout/user-avatar";
import { isUserDeactivated } from "~/utils/user-deactivation";
import { isDmOnline, useOpenDm } from "~/hooks/use-open-dm";

const uniqueDms = (dms: any[] | undefined) => {
  const seen = new Set<string>();
  return (dms || []).filter((dm) => {
    const key = String(dm?.channel_id || dm?.channels_id || "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/** Landing view of the Messages page, shown when no conversation is open. */
const MessagesHome = () => {
  const { state } = useContext(DataContext);
  const router = useRouter();
  const openDm = useOpenDm();

  const dms = useMemo(() => uniqueDms(state?.dms), [state?.dms]);
  const unreadDms = dms.filter((dm) => dm?.thread_count > 0);
  const onlineDms = dms.filter(
    (dm) =>
      dm?.channel_type === "dm" && isDmOnline(dm) && !isUserDeactivated(dm)
  );

  const startNewChat = () =>
    router.push(`/${state?.orgSlug}/home/people/new-chat`);

  const quickActions = [
    {
      title: "Start a DM",
      description: "Chat one-on-one with a mentor or peer.",
      icon: MessageSquare,
      onClick: startNewChat,
    },
    {
      title: "Create a group",
      description: "Bring your cohort or project team together.",
      icon: Users,
      onClick: startNewChat,
    },
    {
      title: "Send a Buzz",
      description: "Jump on a quick call in one click.",
      icon: Phone,
      onClick: () => router.push(`/${state?.orgSlug}/buzzs`),
    },
  ];

  const hasUnread = unreadDms.length > 0;

  return (
    <div className="px-4 py-8 md:px-10 lg:py-10 max-w-[1100px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary-500">Messages</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-blue-500">
            Recent Messages
          </h1>
          <p className="mt-2 text-[15px] text-[#475467]">
            Pick up where you left off, or say hello to someone new.
          </p>
        </div>
        <Button
          onClick={startNewChat}
          className="h-11 self-start sm:self-auto rounded-full bg-primary-500 hover:bg-primary-400 px-5 text-white"
        >
          <Plus size={18} className="mr-1" />
          New message
        </Button>
      </div>

      <section className="mt-8 flex items-center justify-between gap-6 overflow-hidden rounded-[24px] bg-primary-500 p-6 md:p-10">
        <div className="max-w-[460px]">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white">
            {hasUnread
              ? `You have ${unreadDms.length} unread ${unreadDms.length === 1 ? "conversation" : "conversations"}.`
              : "Your inbox is clear. Start a conversation."}
          </h2>
          <p className="mt-3 text-[15px] text-white/85">
            {hasUnread
              ? "Catch up on what you missed, then keep the conversation going."
              : "Mentors, cohorts and teammates are one message away. Choose someone from the list to begin."}
          </p>
          <button
            type="button"
            onClick={() => (hasUnread ? openDm(unreadDms[0]) : startNewChat())}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 font-semibold text-primary-500 hover:bg-primary-50"
          >
            {hasUnread ? "Open latest unread" : "Message someone"}
            <span className="flex size-8 items-center justify-center rounded-full bg-primary-500 text-white">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        <div
          aria-hidden="true"
          className="hidden md:flex flex-col gap-4 w-[260px] shrink-0"
        >
          <div className="w-[180px] rounded-[18px] bg-white/95 p-4">
            <div className="h-2 w-28 rounded-full bg-primary-100" />
            <div className="mt-3 h-2 w-16 rounded-full bg-primary-50" />
          </div>
          <div className="ml-auto w-[200px] rounded-[18px] border border-white/30 bg-[#5B2FE0] p-4">
            <div className="ml-auto h-2 w-32 rounded-full bg-primary-300" />
            <div className="ml-auto mt-3 h-2 w-20 rounded-full bg-primary-300/70" />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-blue-500">Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {quickActions.map(({ title, description, icon: Icon, onClick }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className="rounded-[16px] border border-[#EAECF0] bg-white p-5 text-left transition hover:border-primary-200 hover:shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-[10px] bg-primary-50 text-primary-500">
                <Icon size={18} />
              </span>
              <span className="mt-4 block font-bold text-blue-500">
                {title}
              </span>
              <span className="mt-1 block text-sm text-[#475467]">
                {description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-blue-500">Online now</h2>
        {onlineDms.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-6">
            {onlineDms.map((dm) => (
              <button
                key={String(dm.channel_id || dm.channels_id)}
                type="button"
                onClick={() => openDm(dm)}
                aria-label={`Message ${dm.username}`}
                className="flex w-[64px] flex-col items-center gap-2"
              >
                <span className="relative">
                  <UserAvatar item={dm} size="lg" alt="" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-white bg-[#00AD51]" />
                </span>
                <span className="w-full truncate text-center text-sm text-blue-500">
                  {String(dm.username || "").split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#667085]">
            Nobody from your conversations is online right now.
          </p>
        )}
      </section>
    </div>
  );
};

export default MessagesHome;
