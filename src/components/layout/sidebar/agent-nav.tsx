"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { BrowseIcon, DropdownIcon } from "~/svgs";
import Link from "next/link";
import { GetRequest } from "~/utils/new-request";
import { AgentRecentCard } from "~/app/(client)/[org]/_components/agent-card/recent-card";
import { usePathname } from "next/navigation";
import OrganisationMenu from "~/app/(client)/[org]/_components/org-dropdown";
import { parseStoredAccordions } from "~/utils/stored-accordions";

//

export default function AgentNav({
  resizerRef,
  sidebarWidth,
  sidebarRef,
}: any) {
  const orgId = useMemo(() => localStorage.getItem("orgId"), []);
  const { state, dispatch } = useContext(DataContext);
  const pathname = usePathname();
  const { orgSlug } = state;

  useEffect(() => {
    if (orgId) {
      const fetchBots = async () => {
        const res = await GetRequest(
          `/organisations/${orgId}/fetch-bots?limit=1000`
        );

        if (res?.status === 200 || res?.status === 201) {
          dispatch({ type: ACTIONS.AGENT_DM, payload: res?.data?.data });
        }
      };
      fetchBots();
    }
  }, [orgId, dispatch, state?.agentCallback]);

  // Restore scroll position after re-render
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebar-scroll");
    if (sidebarRef.current && savedScroll) {
      sidebarRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  // Save scroll position before re-render
  const handleScroll = () => {
    if (sidebarRef.current) {
      sessionStorage.setItem(
        "sidebar-scroll",
        sidebarRef.current.scrollTop.toString()
      );
    }
  };

  const [openAccordions, setOpenAccordions] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["activated"];
    return parseStoredAccordions(localStorage.getItem("openAccordions3"), [
      "activated",
    ]);
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOpenAccordions(
        parseStoredAccordions(localStorage.getItem("openAccordions3"), [
          "activated",
          "suggestions",
        ])
      );
      setIsHydrated(true);
    }
  }, []);

  // Function to toggle accordions independently
  const handleAccordionChanges = (values: string[]) => {
    setOpenAccordions(values);
    if (typeof window !== "undefined") {
      localStorage.setItem("openAccordions3", JSON.stringify(values));
    }
  };

  //

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`fixed top-[60px] lg:rounded-tl-[8px] lg:rounded-bl-[8px] bottom-[60px] left-0 lg:left-[85px] h-[100dvh] bg-blue-300 lg:translate-x-0 ${state?.openSidebar ? "translate-x-[85px]" : "-translate-x-full "}
      pt-4 flex flex-col gap-4 sm:w-[350px] transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center px-3 gap-[5px] md:justify-between w-full">
            <OrganisationMenu name="Colleagues" />

            <Link
              href={`/${orgSlug}/colleagues/browse`}
              className={`text-blue-50 flex items-center text-[13px] gap-2 ${pathname === `/${orgSlug}/colleagues/browse` ? "bg-blue-200 p-3 py-2 rounded text-white" : ""}`}
            >
              Browse Colleagues
              <BrowseIcon
                active={
                  pathname === `/${orgSlug}/colleagues/browse` ? true : false
                }
              />
            </Link>
          </div>
        </div>

        <div
          className="overflow-auto [&::-webkit-scrollbar]:hidden text-blue-50 cursor-pointer"
          ref={sidebarRef}
          onScroll={handleScroll}
          onClick={() =>
            dispatch({ type: ACTIONS.OPEN_SIDEBAR, payload: false })
          }
        >
          <div className="">
            {/* Agents */}
            {isHydrated && (
              <Accordion
                type="multiple"
                className="w-full"
                value={openAccordions}
                onValueChange={handleAccordionChanges}
              >
                <AccordionItem value="activated" className="border-none">
                  <AccordionTrigger className="font-normal w-full py-0">
                    <div className="relative py-3 mx-4 flex items-center gap-1 rounded-lg cursor-pointer w-full">
                      <DropdownIcon
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openAccordions.includes("activated")
                            ? "rotate-0"
                            : "-rotate-90"
                        }`}
                      />
                      <h3 className="text-[15px]  font-medium">Activated</h3>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <ul className="flex flex-col gap-1">
                      {state?.agentDm?.map((item: any, index: number) => (
                        <AgentRecentCard {...item} key={index} />
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      </div>

      <div
        ref={resizerRef}
        style={{ left: `${sidebarWidth + 85}px` }}
        className="fixed top-[60px] bottom-[10px] w-1.5 cursor-ew-resize opacity-100 transition-opacity duration-300 z-50 hover:opacity-100"
      />
    </>
  );
}
