"use client";
import { useContext } from "react";
import AllPeopleHeader from "../../_components/people-nav/all-peoples";
import PeopleTab from "../../_components/channels/tabs/peoples-tab";
import HoverSidebar from "../../_components/profile-sidebar/hover-sidebar";
import { DataContext } from "~/store/GlobalState";
import { useIsSmUp } from "~/hooks/use-media-query";

export default function PeoplesPage() {
  const { state } = useContext(DataContext);
  const isSmUp = useIsSmUp();
  const profilePanelWidth = state.hoverProfile && isSmUp ? 408 : 0;

  return (
    <div className="flex h-[calc(100dvh-70px)] relative w-full overflow-hidden">
      <div
        className="flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out"
        style={{ marginRight: `${profilePanelWidth}px` }}
      >
        <AllPeopleHeader />

        <PeopleTab />
      </div>

      {state.hoverProfile && (
        <aside className="fixed right-0 top-0 z-30 mt-[60px] h-full w-full border-l border-[#E6EAEF] bg-white sm:w-[408px]">
          <HoverSidebar />
        </aside>
      )}
    </div>
  );
}
