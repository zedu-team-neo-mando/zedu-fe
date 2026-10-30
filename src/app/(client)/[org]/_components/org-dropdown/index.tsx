"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ChevronDownIcon, ChevronRight } from "lucide-react";
import { DataContext } from "~/store/GlobalState";
import { useContext, useState } from "react";
import Image from "next/image";
import { ACTIONS } from "~/store/Actions";
import { getInitials } from "~/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RequirePermission } from "~/components/rbac/RequirePermission";
import { appStoreUrl, playStoreUrl } from "~/lib/env-urls";
interface Props {
  name?: string;
}

const APP_STORE_URL = appStoreUrl();
const PLAY_STORE_URL = playStoreUrl();

export default function OrganisationMenu({ name }: Props) {
  const { state, dispatch } = useContext(DataContext);
  const { orgData, orgSlug } = state;
  const [subMenu, setSubMenu] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("pending_org");
    } catch {
      // ignore
    }
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  //

  const shouldHideChevron =
    pathname.includes("/dm") || pathname.includes("/people");

  return (
    <div className="">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            <h6 className="text-lg leading-[26px] font-semibold text-white">
              {orgData?.name}
            </h6>
            {!shouldHideChevron && (
              <ChevronDownIcon className="text-white mt-1" />
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[270px] p-0 rounded-md shadow-xl"
          onClick={() =>
            dispatch({
              type: ACTIONS.CHANNEL_BAR,
              payload: !state?.channelBar,
            })
          }
        >
          <div className="">
            <div className="flex items-center gap-2 p-3 border-b font-medium text-sm">
              <div className="size-9 rounded border overflow-hidden flex items-center justify-center">
                {orgData?.logo_url ? (
                  <Image
                    src={orgData?.logo_url}
                    alt="organisation logo"
                    width={50}
                    height={50}
                    unoptimized
                    className="size-9"
                  />
                ) : (
                  <h3 className="text-primary-500 font-bold text-sm uppercase">
                    {getInitials(orgData?.name)}
                  </h3>
                )}
              </div>

              <div className="text-sm uppercase font-semibold">
                {orgData?.name}
              </div>
            </div>
          </div>

          <ul className="text-sm pb-3">
            <RequirePermission permission="invite:members">
              <li
                onClick={() =>
                  dispatch({ type: ACTIONS.INVITE_MODAL, payload: true })
                }
                className="hover:bg-blue-500 hover:text-white cursor-pointer px-4 py-2 text-[15px]"
              >
                Add people to{" "}
                <span className="uppercase font-semibold">{orgData?.name}</span>
              </li>
            </RequirePermission>
            <li>
              <Link
                href={`/${orgSlug}/settings/personal/account`}
                onClick={(event) => event.stopPropagation()}
                className="hover:bg-blue-500 hover:text-white cursor-pointer px-4 py-2 flex justify-between text-[15px]"
              >
                Settings
              </Link>
            </li>
            <li
              className="relative hover:bg-blue-500 hover:text-white cursor-pointer px-4 py-2 flex justify-between text-[15px]"
              onMouseEnter={() => setSubMenu(true)}
              onMouseLeave={() => setSubMenu(false)}
            >
              Apps <ChevronRight className="h-4 w-4" />
              {subMenu && (
                <ul className="absolute left-full top-0 w-[200px] bg-white text-black rounded-[7px] shadow-lg border border-[#E6EAEF] overflow-hidden">
                  <li className="hover:bg-blue-500 hover:text-white cursor-pointer px-4 py-2 flex justify-between text-[15px]">
                    <Link
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Android App
                    </Link>
                  </li>
                  <li className="hover:bg-blue-500 hover:text-white cursor-pointer px-4 py-2 flex justify-between text-[15px]">
                    <Link
                      href={APP_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download IOS App
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li
              onClick={handleLogout}
              className="hover:bg-blue-500 hover:text-white cursor-pointer px-4 py-2 font-medium text-[15px]"
            >
              Sign out
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
