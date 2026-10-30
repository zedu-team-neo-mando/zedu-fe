"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { GetRequest, InviteRequest } from "~/utils/new-request";
import Loading from "~/components/ui/loading";
import { Button } from "~/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { DataContext } from "~/store/GlobalState";

const REDIRECT_SECONDS = 10;

type PendingRedirect = {
  path: string;
  message: string;
};

const InviteForm = () => {
  const { state } = useContext(DataContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const router = useRouter();
  const [orgData, setOrgData] = useState<any>(null);
  const searchParams = useSearchParams();
  const org_id = searchParams.get("org_id");
  const invitation_token = searchParams.get("invitation_token");
  const linkInvalid = !org_id || !invitation_token;
  const [loading, setLoading] = useState(true);
  const [pendingRedirect, setPendingRedirect] =
    useState<PendingRedirect | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(REDIRECT_SECONDS);
  const hasInitialized = useRef(false);

  const getInviteRedirectUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (org_id) params.set("org_id", org_id);
    if (invitation_token) params.set("invitation_token", invitation_token);
    return `/accept_org_invitation?${params.toString()}`;
  }, [org_id, invitation_token]);

  const buildAuthRedirectUrl = useCallback(
    (path: "/auth/sign-up" | "/auth/login", userEmail?: string) => {
      const params = new URLSearchParams();
      params.set("redirect", getInviteRedirectUrl());
      if (userEmail) params.set("email", userEmail);
      return `${path}?${params.toString()}`;
    },
    [getInviteRedirectUrl]
  );

  const isUserLoggedIn = useCallback(() => {
    const localToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return !!(state?.token || localToken);
  }, [state?.token]);

  const acceptInvitation = useCallback(async () => {
    if (!invitation_token) return false;

    setButtonLoading(true);

    const res = await InviteRequest("/invite/verify", {
      token: invitation_token,
    });

    if (res?.status === 200 || res?.status === 201) {
      localStorage.setItem("token", res?.data?.data?.access_token);
      localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
      localStorage.setItem("orgId", res.data.data.user.current_org);

      const orgSlug = res.data.data.user.current_organisation_slug;
      if (orgSlug) {
        localStorage.setItem("orgSlug", orgSlug);
      }

      router.push(`/${orgSlug}/invited`);
      return true;
    }

    setButtonLoading(false);
    setLoading(false);
    return false;
  }, [invitation_token, router]);

  useEffect(() => {
    if (linkInvalid) {
      setLoading(false);
      return;
    }
    if (hasInitialized.current) return;

    hasInitialized.current = true;
    localStorage.setItem("orgId", org_id);

    const getOrgDetails = async () => {
      setLoading(true);
      const res = await GetRequest(
        `/organisations/${org_id}/load-org-info?invitation_token=${invitation_token}`
      );

      if (res?.status !== 200 && res?.status !== 201) {
        setLoading(false);
        return;
      }

      const data = res?.data?.data;
      const isLoggedIn = isUserLoggedIn();
      const isNewUser = data?.is_new_user === true;
      const userEmail = data?.user_email as string | undefined;
      const orgName = data?.organisation_name || "this";
      const formattedOrgName =
        orgName.charAt(0).toUpperCase() + orgName.slice(1);

      setOrgData(data);

      if (!isLoggedIn && isNewUser) {
        setPendingRedirect({
          path: buildAuthRedirectUrl("/auth/sign-up", userEmail),
          message: `Please create an account to continue to join ${formattedOrgName} organisation.`,
        });
      } else if (!isLoggedIn && !isNewUser) {
        setPendingRedirect({
          path: buildAuthRedirectUrl("/auth/login", userEmail),
          message: `Please login to continue to join ${formattedOrgName} organisation.`,
        });
      }

      setLoading(false);
    };

    getOrgDetails();
  }, [
    org_id,
    invitation_token,
    linkInvalid,
    buildAuthRedirectUrl,
    isUserLoggedIn,
  ]);

  useEffect(() => {
    if (!pendingRedirect) return;

    setRedirectCountdown(REDIRECT_SECONDS);

    let remaining = REDIRECT_SECONDS;
    const interval = window.setInterval(() => {
      remaining -= 1;
      setRedirectCountdown(remaining);

      if (remaining <= 0) {
        window.clearInterval(interval);
        router.replace(pendingRedirect.path);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [pendingRedirect, router]);

  const handleAccept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await acceptInvitation();
  };

  return (
    <div className="w-full pb-20">
      <div className="flex w-full flex-col items-center justify-center rounded-md bg-[#faf8f6] py-10 text-center">
        <Link href="/">
          <Image src="/Zedu.png" alt="Zedu home" width={86} height={31} />
        </Link>

        {linkInvalid ? (
          <div
            role="alert"
            className="mt-14 flex w-full max-w-[36rem] flex-col items-center text-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="size-7 text-red-500" aria-hidden="true" />
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              Invalid invitation link
            </h1>
            <p className="mt-3 text-base text-gray-700">
              The invitation link is invalid or has expired. It may have been
              truncated by your email or messaging app. Ask the person who
              invited you to send a new link.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:support@zedu.chat">Contact support</a>
              </Button>
            </div>
          </div>
        ) : loading ? (
          <div className="mx-auto flex h-[30vh] w-full max-w-[48rem] items-center justify-center py-[2rem]">
            <Loading height="50" width="50" color="#7141F8" />
          </div>
        ) : (
          <>
            <h1 className="mt-14 text-[48px] font-bold leading-tight">
              See what{" "}
              <span className="capitalize text-[#6E1EFF]">
                {orgData?.organisation_name}
              </span>{" "}
              is up to
            </h1>

            <p className="mt-2 text-base text-gray-700">
              Zedu brings learners and educators together in one workspace.
            </p>

            <div className="mt-6 flex items-center justify-center">
              <div className="flex -space-x-3">
                {orgData?.users_photos?.map((item: string, index: number) => (
                  <Image
                    key={index}
                    src={item}
                    className="size-14 rounded-lg border-2 border-white object-cover"
                    alt="members"
                    width={100}
                    height={100}
                  />
                ))}
              </div>
            </div>
            <p className="mt-1 text-base text-gray-600">
              {orgData?.org_user_info}.
            </p>
          </>
        )}
      </div>

      {!loading && !linkInvalid && (
        <div className="mx-auto mt-10 w-full max-w-lg rounded-md bg-white text-center">
          <form
            onSubmit={handleAccept}
            className="mt-10 space-y-5 px-8 text-left"
          >
            {pendingRedirect && (
              <div className="rounded-lg border border-[#DDD6FE] bg-[#F4F3FF] px-4 py-4 text-sm text-[#5925DC]">
                <p className="leading-6">{pendingRedirect.message}</p>
                <p className="mt-2 font-semibold">
                  You will be redirected in {redirectCountdown}{" "}
                  {redirectCountdown === 1 ? "second" : "seconds"}...
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={buttonLoading || !!pendingRedirect}
              className="flex w-full items-center justify-center rounded-md bg-blue-200 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Accept Invitation
              {buttonLoading && <Loading />}
            </button>

            {!pendingRedirect && (
              <div className="mt-3 flex items-start gap-2">
                <input
                  id="marketing"
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="marketing" className="text-sm text-gray-600">
                  It’s okay to send me marketing communications about Zedu. I
                  can unsubscribe at any time.
                </label>
              </div>
            )}

            <p className="mt-3 text-xs text-gray-500">
              By continuing, you’re agreeing to our{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                className="text-blue-600 underline"
              >
                User Terms of Service
              </a>
              . Additional disclosures are available in our{" "}
              <a
                href="/policy"
                target="_blank"
                className="text-blue-600 underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default InviteForm;
