"use client";

import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { Bell, Loader2 } from "lucide-react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import OrganisationMenu from "~/app/(client)/[org]/_components/org-dropdown";
import { cn } from "~/lib/utils";
import UserAvatar from "~/components/layout/user-avatar";
import { GetRequest } from "~/utils/new-request";
import { getShowMessagePreviews } from "~/lib/notification-preview";

const LIMIT = 20;

// Hidden-preview text; keeps the sender name for "(name): ..." messages.
const hiddenPreviewText = (message?: string) => {
  const match = /^\(([^)]+)\):/.exec(message ?? "");
  return match
    ? match[1] + " sent a message. Click to view."
    : "Sent a message. Click to view.";
};

export default function NotificationNav() {
  const { state, dispatch } = useContext(DataContext);
  const { orgId, notificationDetail } = state;
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPreviews, setShowPreviews] = useState(true);

  useEffect(() => {
    setShowPreviews(getShowMessagePreviews());
  }, []);

  const resolvedOrgId =
    orgId ||
    (typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "");

  const fetchNotifications = useCallback(
    async (pageNumber: number) => {
      if (!resolvedOrgId) {
        setHasMore(false);
        return;
      }

      setLoading(true);
      const res = await GetRequest(
        `/organisations/${resolvedOrgId}/users/onesignal?page=${pageNumber}&limit=${LIMIT}`
      );

      if (res?.status === 200 || res?.status === 201) {
        const items = res?.data?.data?.notifications || [];
        const pagination = res?.data?.data?.pagination;

        setNotifications((prev) =>
          pageNumber === 1 ? items : [...prev, ...items]
        );

        if (items.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(
            pagination
              ? pagination.current_page < pagination.total_pages_count
              : items.length >= LIMIT
          );
        }
      } else {
        setHasMore(false);
      }

      setLoading(false);
    },
    [resolvedOrgId]
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNotifications(1);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!state.notifications?.length) return;
    const latest = state.notifications[state.notifications.length - 1];
    if (!latest) return;
    const id =
      latest.id ||
      latest.message_id ||
      latest.messages_id ||
      `notif-${Date.now()}`;
    const newEntry = {
      id,
      title: latest.title || latest.sender_name || "New Notification",
      message: latest.message || latest.body || "",
      avatar_url: latest.avatar_url || latest.default_avatar_url,
      sent_at: latest.sent_at || latest.created_at || new Date().toISOString(),
      created_at: latest.created_at || new Date().toISOString(),
      payload: latest.payload || latest,
    };
    setNotifications((prev) => {
      if (prev.some((item) => String(item.id) === String(id))) return prev;
      return [newEntry, ...prev];
    });
  }, [state.notifications]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebar-scroll");
    if (sidebarRef.current && savedScroll) {
      sidebarRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleScroll = () => {
    if (sidebarRef.current) {
      sessionStorage.setItem(
        "sidebar-scroll",
        sidebarRef.current.scrollTop.toString()
      );
    }
  };

  return (
    <div
      className={`fixed top-[60px] lg:rounded-tl-[8px] lg:rounded-bl-[8px] bottom-[60px] left-0 lg:left-[85px] h-[100dvh] bg-blue-300 lg:translate-x-0 ${state?.openSidebar ? "translate-x-[85px]" : "-translate-x-full "}
      pt-4 flex flex-col gap-4 sm:w-[350px] transition-transform duration-300 ease-in-out z-30`}
    >
      <div
        id="notificationScrollableDiv"
        className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden text-blue-50 cursor-pointer pb-20"
        ref={sidebarRef}
        onScroll={handleScroll}
      >
        <InfiniteScroll
          dataLength={notifications.length}
          next={loadMore}
          hasMore={hasMore && notifications.length > 0}
          loader={
            notifications.length > 0 ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-white/70" size={20} />
              </div>
            ) : null
          }
          scrollableTarget="notificationScrollableDiv"
        >
          <div className="flex flex-col">
            {loading && notifications.length === 0 && (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-white/70" size={20} />
              </div>
            )}

            {notifications.map((item, index) => (
              <Fragment key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.NOTIFICATION_DETAIL,
                      payload: item,
                    });
                    dispatch({
                      type: ACTIONS.DECREMENT_NOTIFICATION_BADGE,
                      payload: 1,
                    });
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 px-3 py-4 text-left hover:bg-[#4B4BB4]",
                    notificationDetail?.id === item.id && "bg-[#4B4BB4]"
                  )}
                >
                  <div className="relative size-8 shrink-0">
                    {item.avatar_url ? (
                      <UserAvatar
                        item={item}
                        src={item.avatar_url}
                        userType="user"
                        size="sidebar"
                        alt={item.title}
                      />
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-[7px] bg-[#5F5FE1] text-white">
                        <Bell size={16} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <span className="line-clamp-2 max-w-[200px] break-words text-[15px] font-semibold text-white">
                        {item.title}
                      </span>
                      <span className="shrink-0 text-[12px] text-[#BABAFB]">
                        {moment(item.sent_at || item.created_at).format("LT")}
                      </span>
                    </div>
                    <p className="line-clamp-2 max-w-[220px] break-words text-[14px] text-[#D0D0FD]">
                      {showPreviews ? (
                        item.message
                      ) : (
                        <span className="italic">
                          {hiddenPreviewText(item.message)}
                        </span>
                      )}
                    </p>
                  </div>
                </button>

                {index !== notifications.length - 1 && (
                  <hr className="border-[#5F5FE1]" />
                )}
              </Fragment>
            ))}

            {!loading && notifications.length === 0 && (
              <p className="mt-10 text-center">No recent notifications</p>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
