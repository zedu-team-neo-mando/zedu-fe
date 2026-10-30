"use client";

import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { usePathname } from "next/navigation";
import {
  UserIcon,
  BellIcon,
  LockIcon,
  SettingsIcon,
  UsersIcon,
  BanknoteIcon,
  Webhook,
  Palette,
  Layers,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { DropdownIcon } from "~/svgs";
import Link from "next/link";
import OrganisationMenu from "../../_components/org-dropdown";
import { useRBAC } from "~/hooks/useRBAC";
import {
  ORG_SETTINGS_NAV_ITEMS,
  type PermissionRequirement,
} from "~/config/access-control";
import { evaluatePermissionRequirement } from "~/components/rbac/RequirePermission";
import { parseStoredAccordions } from "~/utils/stored-accordions";

const ORG_NAV_ICONS: Record<string, React.ReactNode> = {
  general: <SettingsIcon className="w-5" />,
  "user-management": <UsersIcon className="w-5" />,
  "roles-permissions": <UserIcon className="w-5" />,
  webhooks: <Webhook className="w-5" />,
  "channel-management": <Layers className="w-5" />,
  billing: <BanknoteIcon className="w-5" />,
};

export default function SettingsNav() {
  const { state, dispatch } = useContext(DataContext);
  const [openAccordions, setOpenAccordions] = useState<string[]>(() => {
    const defaults = ["personal", "organisation"];
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("Accordions2")
        : null;

    return parseStoredAccordions(saved, defaults);
  });

  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { orgSlug } = state;

  const { hasPermission, status } = useRBAC();

  const canAccessRequirement = (access: PermissionRequirement) => {
    if (status !== "authorized") return false;
    return evaluatePermissionRequirement(
      access,
      hasPermission,
      (keys) => keys.some((key) => hasPermission(key)),
      (keys) => keys.every((key) => hasPermission(key))
    );
  };

  const organisationContent = useMemo(
    () =>
      ORG_SETTINGS_NAV_ITEMS.filter((item) =>
        canAccessRequirement(item.access)
      ).map((item) => ({
        title: item.title,
        icon: ORG_NAV_ICONS[item.id] ?? <SettingsIcon className="w-5" />,
        link: `/${orgSlug}/settings/organisation/${item.pathSegment}`,
      })),
    [hasPermission, status, orgSlug]
  );

  const settings = [
    {
      id: "personal",
      trigger: "Personal",
      content: [
        {
          title: "Account",
          icon: <UserIcon className="w-5" />,
          link: `/${orgSlug}/settings/personal/account`,
        },
        {
          title: "Notifications",
          icon: <BellIcon className="w-5" />,
          link: `/${orgSlug}/settings/personal/notifications`,
        },
        {
          title: "Appearance",
          icon: <Palette className="w-5" />,
          link: `/${orgSlug}/settings/personal/appearance`,
        },
        {
          title: "Security",
          icon: <LockIcon className="w-5" />,
          link: `/${orgSlug}/settings/personal/security`,
        },
      ],
    },
    ...(organisationContent.length
      ? [
          {
            id: "organisation",
            trigger: "Organisation",
            content: organisationContent,
          },
        ]
      : []),
  ];

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebar-scroll");
    if (sidebarRef.current && savedScroll) {
      sidebarRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleAccordionChanges = (values: string[]) => {
    setOpenAccordions(values);
    localStorage.setItem("Accordions2", JSON.stringify(values));
  };

  return (
    <div
      className={`fixed top-[60px] lg:left-[85px] h-[calc(100vh-60px)] lg:rounded-tl-[8px] z-30 bg-blue-300 lg:translate-x-0 ${state?.openSidebar ? "translate-x-[85px]" : "-translate-x-full "}
  pt-4 flex flex-col gap-4 w-[270px] transition-transform duration-300 ease-in-out`}
    >
      <div
        className="overflow-auto text-blue-50 cursor-pointer px-3"
        ref={sidebarRef}
        onClick={() => dispatch({ type: ACTIONS.OPEN_SIDEBAR, payload: false })}
      >
        <Accordion
          type="multiple"
          className="w-full"
          value={openAccordions}
          onValueChange={handleAccordionChanges}
        >
          {settings.map((setting) => (
            <AccordionItem
              key={setting.id}
              value={setting.id}
              className="border-none"
            >
              <AccordionTrigger className="font-normal w-full py-0">
                <div className="relative py-3 mx-2 flex items-center gap-1 rounded-lg cursor-pointer w-full">
                  <DropdownIcon
                    className={`transition-transform duration-300 ${
                      openAccordions.includes(setting.id)
                        ? "rotate-0"
                        : "-rotate-90"
                    }`}
                  />
                  <h3 className="text-sm font-medium">{setting.trigger}</h3>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <ul className="flex flex-col gap-1">
                  {setting.content.map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg ${pathname === item.link ? "bg-blue-200" : "hover:bg-blue-200"}`}
                    >
                      <div className="text-blue-50">{item.icon}</div>
                      <Link
                        href={item.link}
                        aria-current={
                          pathname === item.link ? "page" : undefined
                        }
                        className={`text-sm leading-4 truncate w-full text-blue-50 ${pathname === item.link ? "text-white" : ""} `}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
