import React, { Suspense } from "react";
import type { Metadata } from "next";
import InviteForm from "./invite-form";
import { invitePreviewMetadata } from "~/lib/invite-preview-metadata";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  return invitePreviewMetadata("/accept_general_invitation", searchParams);
}

const AcceptOrgInvite = () => {
  return (
    <div className="">
      <Suspense
        fallback={
          <p className="w-full max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-[3.5rem] mb-[2rem] text-lg">
            Loading...
          </p>
        }
      >
        <InviteForm />
      </Suspense>
    </div>
  );
};

export default AcceptOrgInvite;
