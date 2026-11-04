"use client";
import React, { useContext } from "react";
import OrganisationMenu from "~/app/(client)/[org]/_components/org-dropdown";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { EditIcon, File, Files, Trash2, Users, XIcon } from "lucide-react";
import SideBarBtns from "~/app/(client)/[org]/_components/file-management/sidebar-btns";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export type FileView =
  | "All files"
  | "My files"
  | "Shared with me"
  | "Deleted files";

const sidebarBtns: { icon: typeof Files; label: FileView; path: string }[] = [
  { icon: Files, label: "All files", path: "/files" },
  { icon: File, label: "My files", path: "/files/my-files" },
  { icon: Users, label: "Shared with me", path: "/files/shared" },
  { icon: Trash2, label: "Deleted files", path: "/files/trash" },
];

const FilesNav = () => {
  const { state, dispatch } = useContext(DataContext);
  const params = useParams();
  const pathname = usePathname();
  const org = params.org as string;

  const isActive = (path: string) => {
    const fullPath = `/${org}${path}`;
    if (path === "/files") {
      return pathname === fullPath;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <div
      className={`fixed top-[60px] bottom-[60px] left-0 lg:left-[85px] z-30 h-[calc(100vh-30px)] bg-blue-300 lg:translate-x-0 pt-4 flex flex-col gap-6 sm:w-[270px] transition-transform duration-300 ease-in-out
    ${state?.openSidebar ? "translate-x-[85px]" : "-translate-x-full "}`}
    >
      {/* Main content for the file management sidebar */}
      <section className="flex flex-col gap-[1px] justify-center w-full ">
        {sidebarBtns.map((btnData) => (
          <Link key={btnData.label} href={`/${org}${btnData.path}`}>
            <SideBarBtns
              icon={btnData.icon}
              label={btnData.label}
              isActive={isActive(btnData.path)}
            />
          </Link>
        ))}
      </section>
    </div>
  );
};

export default FilesNav;
