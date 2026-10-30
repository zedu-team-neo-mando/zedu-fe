"use client";

import Image from "next/image";
import Link from "next/link";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { DataContext } from "~/store/GlobalState";
import { WidgetIcon } from "../svgs";
import { ArrowBtn, OutlineBtn } from "../ui/Button";

type NavLink = {
  label: string;
  href: string;
};

type DropdownSection = {
  title: string;
  basePath: string;
  overviewHref: string;
  items: NavLink[];
};

const dropdownSections: DropdownSection[] = [
  {
    title: "Products",
    basePath: "/products",
    overviewHref: "/products",
    items: [
      { label: "Buzz", href: "/products/buzz" },
      { label: "Channels", href: "/products/channels" },
      { label: "File Management", href: "/products/file-management" },
    ],
  },
  {
    title: "Solutions",
    basePath: "/solutions",
    overviewHref: "/solutions",
    items: [
      { label: "Bootcamps", href: "/solutions/bootcamps" },
      { label: "Schools", href: "/solutions/schools" },
      { label: "Universities", href: "/solutions/universities" },
    ],
  },
];

const topLevelLinks: NavLink[] = [
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Download", href: "/download" },
];

const Header: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownNavigationRef = React.useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { state } = useContext(DataContext);

  const logoWhite = "/zedu_white.png";
  const logoBlack = "/Zedu.png";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    const userToken = localStorage.getItem("token");
    setToken(userToken);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!openDropdown) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dropdownNavigationRef.current?.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openDropdown]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {windowWidth < 1024 && isOpen ? (
        <div className="fixed inset-0 z-40 bg-black opacity-50" />
      ) : null}

      <nav className="relative z-[1000] w-full bg-white lg:px-0">
        <div
          className={`fixed inset-x-0 top-0 z-[60] flex h-20 max-w-[100dvw] items-center justify-between border-b-[1px] transition-colors duration-300 lg:border-[#F2F4F7] ${
            windowWidth < 1024 && isOpen
              ? "border-white/20 bg-[#5A34C6]"
              : "border-[#F2F4F7] bg-white"
          }`}
        >
          <div className="group relative mx-auto flex w-full max-w-[1300px] items-center justify-between px-4 md:px-6 lg:px-4 xl:px-8">
            <div className="z-50 flex items-center gap-8 px-0">
              <div className="flex shrink-0 items-center">
                <Link href="/">
                  <Image
                    className="h-8 w-auto"
                    src={windowWidth < 1024 && isOpen ? logoWhite : logoBlack}
                    alt="Zedu"
                    width={100}
                    height={100}
                  />
                </Link>
              </div>

              <div className="hidden h-6 border-l border-[#F0F2F5] lg:block" />

              <div
                ref={dropdownNavigationRef}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setOpenDropdown(null);
                }}
                className="hidden h-16 items-center sm:space-x-4 md:space-x-6 lg:flex"
              >
                {dropdownSections.map((section) => (
                  <div key={section.title} className="relative h-full">
                    <button
                      type="button"
                      aria-expanded={openDropdown === section.title}
                      aria-controls={`${section.title.toLowerCase()}-dropdown`}
                      onClick={() =>
                        setOpenDropdown((current) =>
                          current === section.title ? null : section.title
                        )
                      }
                      className={`flex h-full items-center gap-1 border-b-2 px-1 pt-1 text-sm font-medium text-[#344054] transition-colors duration-200 hover:text-[#5F5FE1] ${
                        pathname?.includes(section.basePath)
                          ? "border-primary-500 text-[#5F5FE1]"
                          : "border-transparent"
                      }`}
                    >
                      {section.title}
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {openDropdown === section.title && (
                      <div
                        id={`${section.title.toLowerCase()}-dropdown`}
                        className="absolute left-0 top-full z-[9999] mt-1 w-56 rounded-lg bg-white p-4 shadow-md"
                      >
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`block rounded-md px-2 py-2 transition-colors duration-200 hover:bg-[#F2F4F7] hover:text-[#5F5FE1] focus:bg-[#F2F4F7] focus:text-[#5F5FE1] ${
                              pathname === item.href
                                ? "font-medium text-primary-500"
                                : ""
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {topLevelLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`item-center flex h-full flex-col justify-center border-b-2 px-1 pt-1 text-sm font-medium text-[#344054] transition-colors duration-200 hover:text-[#5F5FE1] ${
                      pathname?.includes(item.href)
                        ? "border-primary-500 text-[#5F5FE1]"
                        : "border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="buttons z-50 hidden items-center gap-4 lg:flex">
              {!token ? (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-[#344054] hover:text-black"
                  >
                    Log in
                  </Link>
                  <div className="h-6 border-l border-[#E5E7EB]" />
                  <div className="flex items-center gap-4">
                    <OutlineBtn
                      text="Contact Sales"
                      href="/contact-sales"
                      className="px-3 py-1.5"
                    />
                    <ArrowBtn
                      text="Get Started"
                      linkToHome
                      hideArrow
                      className="px-3 py-1.5"
                    />
                  </div>
                </>
              ) : (
                <>
                  <OutlineBtn
                    text="Contact Sales"
                    href="/contact-sales"
                    className="px-3 py-1.5"
                  />

                  <ArrowBtn
                    text="Go to Dashboard"
                    linkToHome
                    hideArrow
                    className="px-3 py-1.5"
                  />
                </>
              )}
            </div>

            <Button
              ref={menuButtonRef}
              type="button"
              variant="ghost"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={toggleMenu}
              className="relative z-50 flex h-6 w-6 cursor-pointer items-center justify-center p-0 hover:bg-transparent lg:hidden"
            >
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-full bg-current transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-45 bg-gray-50" : "-translate-y-1.5"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-full bg-current transition-opacity duration-300 ease-in-out ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-0.5 w-full bg-current transition-transform duration-300 ease-in-out ${
                  isOpen ? "-rotate-45 bg-gray-50" : "translate-y-1.5"
                }`}
              />
            </Button>
          </div>
        </div>

        {isOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="fixed inset-x-0 top-0 z-50 h-full overflow-y-auto bg-gradient-to-b from-[#5A34C6] to-[#4A2BA3] px-4 pt-20 lg:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
          >
            <div className="flex flex-col justify-between gap-4 py-4">
              <div className="flex flex-col gap-4 text-white">
                <Accordion type="single" collapsible className="w-full px-4">
                  {dropdownSections.map((section, index) => (
                    <AccordionItem
                      key={section.title}
                      value={`item-${index + 1}`}
                      className="border-white/20"
                    >
                      <AccordionTrigger className="font-medium text-[#F8F9FC]">
                        {section.title}
                        <ChevronDown className="group-[[data-state=open]]:rotate-180 transition-transform duration-200" />
                      </AccordionTrigger>

                      <AccordionContent className="flex flex-col gap-2 pt-2">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-white/10 ${
                              pathname === item.href
                                ? "bg-white/20 font-medium text-white"
                                : ""
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {topLevelLinks.map((item) => (
                  <div
                    key={item.href}
                    className={`rounded-lg transition-colors duration-200 hover:bg-white/10 ${
                      pathname?.includes(item.href) ? "bg-white/20" : ""
                    }`}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2"
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>

              {!loading && token ? (
                <Link
                  href="/client"
                  className="mx-4 flex items-center justify-center rounded-lg bg-white/20 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/30"
                >
                  Go to dashboard
                </Link>
              ) : (
                <div className="mt-4 flex flex-col gap-3 px-4">
                  <Link
                    href="/auth/login"
                    className="flex w-full items-center justify-center rounded-lg bg-white/20 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/30"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/contact-sales"
                    className="flex w-full items-center justify-center rounded-lg border border-white/40 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact Sales
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#8860F8] to-[#7141F8] py-3 text-sm font-medium text-white transition-colors duration-200 hover:from-[#7141F8] hover:to-[#8860F8]"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </nav>
    </>
  );
};

export default Header;
