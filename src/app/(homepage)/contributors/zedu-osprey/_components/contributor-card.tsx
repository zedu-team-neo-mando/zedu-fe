"use client";

import * as Popover from "@radix-ui/react-popover";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { Contributor } from "../_lib/contributors";

const OSPREY_AVATAR = "/zedu-icon.png";

export const ContributorCard = ({ name, username }: Contributor) => {
  const [open, setOpen] = useState(false);
  const profileId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openedByHover = useRef(false);

  const keepOpen = () => clearTimeout(closeTimer.current);
  const openOnHover = () => {
    keepOpen();
    openedByHover.current = true;
    setOpen(true);
  };
  const closeAfterHover = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 100);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`View ${name}'s contributor profile`}
          onClick={(event) => {
            event.preventDefault();
            openedByHover.current = false;
            setOpen(true);
          }}
          onPointerEnter={openOnHover}
          onPointerLeave={closeAfterHover}
          className="group flex h-full w-full flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <span className="flex size-24 items-end justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-50 via-white to-amber-50 ring-4 ring-white shadow-sm transition-transform group-hover:scale-105">
            <Image
              src={OSPREY_AVATAR}
              alt=""
              width={96}
              height={96}
              className="h-[92%] w-[92%] object-contain object-bottom"
            />
          </span>
          <span className="flex w-full min-w-0 flex-col gap-1">
            <span className="truncate text-base font-semibold text-neutral-900 sm:text-lg">
              {name}
            </span>
            <span className="truncate text-sm text-neutral-500">
              @{username}
            </span>
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          collisionPadding={16}
          aria-labelledby={`${profileId}-title`}
          aria-describedby={`${profileId}-description`}
          onOpenAutoFocus={(event) => {
            if (openedByHover.current) event.preventDefault();
          }}
          onCloseAutoFocus={(event) => {
            if (openedByHover.current) event.preventDefault();
          }}
          onPointerEnter={keepOpen}
          onPointerLeave={closeAfterHover}
          className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-end justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-50 via-white to-amber-50 ring-1 ring-neutral-200">
              <Image
                src={OSPREY_AVATAR}
                alt=""
                width={64}
                height={64}
                className="h-[92%] w-[92%] object-contain object-bottom"
              />
            </div>
            <div className="min-w-0">
              <h3
                id={`${profileId}-title`}
                className="truncate text-lg font-semibold text-neutral-900"
              >
                {name}
              </h3>
              <p className="truncate text-sm text-neutral-500">@{username}</p>
            </div>
          </div>

          <div className="my-4 h-px bg-neutral-100" />
          <div className="rounded-xl bg-primary-50/70 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <Sparkles
                className="size-4 text-primary-500"
                aria-hidden="true"
              />
              Contributions
            </p>
            <p
              id={`${profileId}-description`}
              className="text-sm leading-6 text-neutral-600"
            >
              Contribution highlights are coming soon. The Osprey team is
              building great things together.
            </p>
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
