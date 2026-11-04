import { useEffect, useRef } from "react";

// Every page under [org] inherits one static title from its layout, and the
// section layouts are client components, so they can't export their own
// metadata. Set "<Section> | Zedu" from the path instead.
const SECTION_TITLES: Record<string, string> = {
  home: "Home",
  channels: "Channels",
  dm: "DMs",
  dms: "DMs",
  people: "People",
  colleagues: "People",
  files: "Files",
  buzzs: "Buzzes",
  threads: "Threads",
  notifications: "Notifications",
  search: "Search",
  later: "Later",
  settings: "Settings",
};

const getPageTitle = (pathname: string): string | null => {
  // pathname looks like /<org>/<section>/<subsection>/...
  const [, , section, subsection] = pathname.split("/");
  // The org root (/<org>) is the Home screen.
  if (!section) return `${SECTION_TITLES.home} | Zedu`;

  // Chats opened from People live under /home/people/.../dm and .../dms.
  if (
    section === "home" &&
    subsection === "people" &&
    (pathname.endsWith("/dm") || pathname.endsWith("/dms"))
  ) {
    return `${SECTION_TITLES.dms} | Zedu`;
  }

  if (section === "home" && subsection && SECTION_TITLES[subsection]) {
    return `${SECTION_TITLES[subsection]} | Zedu`;
  }

  return SECTION_TITLES[section] ? `${SECTION_TITLES[section]} | Zedu` : null;
};

const usePageTitle = (pathname: string) => {
  const defaultTitle = useRef<string | null>(null);
  const ownTitle = useRef<string | null>(null);

  useEffect(() => {
    if (defaultTitle.current === null) defaultTitle.current = document.title;
    const title = getPageTitle(pathname);

    // Paths without a section title (e.g. /<org>/buzz-record/<id>) keep the
    // title from their own route metadata. Only undo our title if it is still
    // showing, so we never overwrite what Next.js set.
    if (title === null) {
      if (ownTitle.current !== null && document.title === ownTitle.current) {
        document.title = defaultTitle.current;
      }
      ownTitle.current = null;
      return;
    }
    ownTitle.current = title;

    // Next.js can add its metadata <title> after this effect runs, so keep
    // every <title> in sync while this page is open.
    const apply = () => {
      document.querySelectorAll("title").forEach((el) => {
        if (el.textContent !== title) el.textContent = title;
      });
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [pathname]);
};

export default usePageTitle;
