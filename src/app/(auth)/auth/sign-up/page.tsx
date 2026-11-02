"use client";

import Link from "next/link";
import { campaignPayload } from "~/lib/campaign-attribution";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "~/components/ui/checkbox";
import Loading from "~/components/ui/loading";
import { PostRequest } from "~/utils/request";
import { showError } from "~/components/toast/sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { RegisterWebhookRequest } from "~/utils/webhook-request";
import AppleSignin from "react-apple-signin-auth";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import {
  PASSWORD_HINT,
  PASSWORD_TOO_SHORT_MESSAGE,
  isPasswordTooShort,
} from "~/lib/password";
import { isAutoCreatedOrg } from "~/utils/organisation";
import { getSafeRedirect } from "~/utils/safe-redirect";
import { AuthWorkspacePanel } from "~/app/(auth)/_components/auth-workspace-panel";

/**
 * Modernized user registration page supporting email/password, Google, Apple auth,
 * workspace design system, and referral attribution.
 */
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleloading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [refParam, setRefParam] = useState<string | null>(null);

  useEffect(() => {
    const rawRef = searchParams.get("ref") || searchParams.get("referral");
    if (rawRef) {
      setRefParam(rawRef);
      try {
        localStorage.setItem("zedu:incoming_ref:v1", rawRef);
      } catch {
        /* ignore */
      }
    } else {
      try {
        const stored = localStorage.getItem("zedu:incoming_ref:v1");
        if (stored) setRefParam(stored);
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  const toWelcome = (slug: string) => {
    const tmpl = searchParams.get("template")?.trim();
    return tmpl
      ? `/${slug}/welcome?template=${encodeURIComponent(tmpl)}`
      : `/${slug}/welcome`;
  };

  const handleAppleSuccess = async (response: any) => {
    setAppleLoading(true);
    try {
      const id_token = response?.authorization?.id_token;
      if (!id_token) throw new Error("No id_token from Apple");
      const res = await PostRequest("/auth/apple", {
        id_token,
        ...campaignPayload(),
      });
      if (res?.status === 200 || res?.status === 201) {
        const user = res?.data?.data?.user;
        const redirectUrl = getSafeRedirect(searchParams.get("redirect"));
        localStorage.setItem("token", res?.data?.data?.access_token);
        localStorage.setItem("useremail", user?.email);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("orgId", user?.current_org);
        const orgSlug = res.data.data.user.current_organisation_slug;
        if (orgSlug) {
          localStorage.setItem("orgSlug", orgSlug);
        }

        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          if (
            user?.is_onboarded &&
            !isAutoCreatedOrg(user?.organisation?.type)
          ) {
            router.push(`/${orgSlug}`);
          } else {
            router.push(toWelcome(orgSlug));
          }
        }

        const message = `\nName: ${user?.username}\nEmail: ${user?.email}`;
        await RegisterWebhookRequest(
          user?.username,
          "User Registration (Apple)",
          message.trim(),
          "success"
        );
      }
    } catch (err) {
      console.error("Apple Signup Error:", err);
    } finally {
      setAppleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setPasswordFocused(true);
  };

  const handleBlur = () => {
    setPasswordFocused(false);
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (isPasswordTooShort(password)) {
      newErrors.password = PASSWORD_TOO_SHORT_MESSAGE;
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    const trimmedEmail = email.trim();
    if (trimmedEmail !== email) {
      setEmail(trimmedEmail);
    }

    if (validateForm()) {
      setLoading(true);

      const payload = {
        email: trimmedEmail,
        password,
        ...campaignPayload(),
      };

      const redirectUrl = getSafeRedirect(searchParams.get("redirect"));
      const coworkerId = searchParams.get("coworkerId") || "";

      const res = await PostRequest("/auth/register", payload);

      if (res?.status === 200 || res?.status === 201) {
        localStorage.setItem("token", res?.data?.data?.access_token);
        localStorage.setItem("useremail", res?.data?.data?.user?.email);
        localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
        localStorage.setItem("orgId", res?.data?.data?.user?.current_org);

        const orgSlug = res.data.data.user.current_organisation_slug;
        if (orgSlug) {
          localStorage.setItem("orgSlug", orgSlug);
        }

        if (redirectUrl) {
          const finalRedirectUrl = coworkerId
            ? `${redirectUrl}?coworkerId=${coworkerId}`
            : redirectUrl;
          setTimeout(() => {
            router.push(finalRedirectUrl);
          }, 100);
        } else {
          setTimeout(() => {
            if (
              res?.data?.data?.user?.is_onboarded &&
              !isAutoCreatedOrg(res?.data?.data?.user?.organisation?.type)
            ) {
              router.push(`/${orgSlug}`);
            } else {
              router.push(toWelcome(orgSlug));
            }
          }, 100);
        }

        const user = res?.data?.data?.user;
        const message = `\nName: ${user?.username}\nEmail: ${user?.email}`;

        await RegisterWebhookRequest(
          user?.username,
          "User Registration",
          message.trim(),
          "success"
        );
      } else {
        setLoading(false);
        RegisterWebhookRequest(
          trimmedEmail,
          "New User Registration",
          "Error authenticating user",
          "error"
        );
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
  };

  const handleEmailBlur = () => {
    setEmail((current) => current.trim());
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      setGoogleloading(true);
      const { code } = tokenResponse;

      try {
        const res = await PostRequest("/auth/google", {
          grant_code: code,
          ...campaignPayload(),
        });

        if (res?.status === 200 || res?.status === 201) {
          const user = res?.data?.data?.user;
          const redirectUrl = getSafeRedirect(searchParams.get("redirect"));

          localStorage.setItem("token", res?.data?.data?.access_token);
          localStorage.setItem("useremail", user?.email);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("orgId", user?.current_org);
          const orgSlug = res.data.data.user.current_organisation_slug;
          if (orgSlug) {
            localStorage.setItem("orgSlug", orgSlug);
          }

          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            if (
              user?.is_onboarded &&
              !isAutoCreatedOrg(user?.organisation?.type)
            ) {
              router.push(`/${orgSlug}`);
            } else {
              router.push(toWelcome(orgSlug));
            }
          }

          const message = `\nName: ${user?.username}\nEmail: ${user?.email}`;

          RegisterWebhookRequest(
            user?.username,
            "User Registration",
            message.trim(),
            "success"
          );
        }
      } catch (err) {
        console.error("Google Login Error:", err);
      } finally {
        setGoogleloading(false);
      }
    },
    onError: (error) => {
      setGoogleloading(false);
      console.error("Google Sign-up Failed:", error);
      if (error.error !== "access_denied") {
        showError(
          "Google sign-up failed",
          "Try again, or sign up with email and password instead."
        );
      }
    },
    onNonOAuthError: (error) => {
      setGoogleloading(false);
      console.error("Google Sign-up Failed:", error);
      if (error.type === "popup_failed_to_open") {
        showError(
          "Google sign-up failed",
          "Allow pop-ups for this site, then try again."
        );
      }
    },
  });

  return (
    <main className="w-full min-h-screen flex bg-white text-neutral-900">
      {/* Modern Workspace Left Brand Panel */}
      <AuthWorkspacePanel
        title="Stay focused while Zedu handles the hustle."
        subtitle="Collaborate effortlessly with channels, audio Buzz rooms, and smart cohorts."
        channelName="#cohort-alpha"
      />

      {/* Right Form Container */}
      <section className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Top navigation bar */}
        <header className="flex items-center justify-between w-full max-w-lg mx-auto">
          <Link
            href="/"
            aria-label="Zedu home"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
          >
            <Image
              src="/Zedu.png"
              alt="Zedu home"
              width={86}
              height={31}
              priority
            />
          </Link>
          <div className="text-xs sm:text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#7141F8] font-semibold hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8]"
            >
              Log in
            </Link>
          </div>
        </header>

        {/* Center Form */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Get started with your team workspace.
            </p>
          </div>

          {refParam && (
            <div
              data-testid="signup-referral-banner"
              className="w-full mb-5 flex items-center gap-2.5 rounded-xl bg-violet-50 border border-violet-200/80 px-4 py-3 text-xs text-violet-900 shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-[#7141F8] shrink-0" />
              <span>
                Invited by <strong>@{refParam}</strong>! Complete sign-up to
                unlock your 100 starter point bonus.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="w-full">
            <div className="space-y-4">
              {/* Email input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="you@example.com"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/50 hover:bg-white focus:bg-white transition-all outline-none ${
                    errors.email
                      ? "border-[#F81404] ring-1 ring-[#F81404]"
                      : "border-neutral-200 focus:border-[#7141F8] focus:ring-2 focus:ring-[#7141F8]/20"
                  }`}
                />
                {errors.email && (
                  <small
                    id="email-error"
                    role="alert"
                    aria-live="assertive"
                    className="block mt-1 text-xs text-[#F81404] font-medium"
                  >
                    {errors.email}
                  </small>
                )}
              </div>

              {/* Password input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="password-help"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Create a password"
                    className={`w-full h-11 px-3.5 pr-11 rounded-lg border text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/50 hover:bg-white focus:bg-white transition-all outline-none ${
                      formSubmitted && errors.password
                        ? "border-[#F81404] ring-1 ring-[#F81404]"
                        : "border-neutral-200 focus:border-[#7141F8] focus:ring-2 focus:ring-[#7141F8]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-neutral-400 hover:text-neutral-700 rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-controls="password"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <small
                  id="password-help"
                  className={`block mt-1.5 text-xs ${
                    errors.password
                      ? "text-[#F81404] font-medium"
                      : "text-neutral-500"
                  }`}
                >
                  {errors.password || PASSWORD_HINT}
                </small>
              </div>

              {/* Stay Signed In Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="stay-signed-in"
                  name="stay-signed-in"
                  checked={staySignedIn}
                  onCheckedChange={(checked) =>
                    setStaySignedIn(checked === true)
                  }
                  className="border-neutral-300 rounded data-[state=checked]:bg-[#7141F8] data-[state=checked]:border-[#7141F8] focus-visible:ring-[#7141F8]"
                />
                <label
                  htmlFor="stay-signed-in"
                  className="text-sm font-medium text-neutral-700 cursor-pointer select-none"
                >
                  Stay signed in
                </label>
              </div>
            </div>

            {/* Primary Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={googleloading || appleLoading || loading}
                aria-label="Create account"
                aria-busy={loading}
                className="w-full h-11 rounded-lg bg-[#7141F8] hover:bg-[#5f30e6] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
              >
                {loading ? (
                  <span className="flex items-center gap-x-2">
                    <span className="animate-pulse">Creating...</span>
                    <Loading width="18" height="18" />
                  </span>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>
              <div role="status" aria-live="polite" className="sr-only">
                {loading ? "Creating account..." : ""}
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-neutral-400 uppercase tracking-wider">
                or
              </span>
            </div>

            {/* Social Registration Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Sign-up */}
              <Button
                type="button"
                variant="outline"
                onClick={() => login()}
                disabled={googleloading || appleLoading}
                aria-label="Sign up with Google"
                aria-busy={googleloading}
                className="w-full h-11 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Image
                  src="/dashboard/google.svg"
                  width={18}
                  height={18}
                  alt=""
                  aria-hidden="true"
                />
                {googleloading ? (
                  <span className="animate-pulse text-xs">Connecting...</span>
                ) : (
                  <span>Google</span>
                )}
              </Button>

              {/* Apple Sign-up */}
              <AppleSignin
                authOptions={{
                  clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
                  scope: "email name",
                  redirectURI:
                    typeof window !== "undefined"
                      ? window.location.origin + "/auth/sign-up"
                      : "",
                  usePopup: true,
                }}
                uiType="dark"
                noDefaultStyle={true}
                render={(props: {
                  onClick: (e?: React.MouseEvent) => void;
                }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={props.onClick}
                    disabled={appleLoading || googleloading}
                    aria-label="Sign up with Apple"
                    aria-busy={appleLoading}
                    className="w-full h-11 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Image
                      src="/dashboard/apple.png"
                      width={18}
                      height={18}
                      alt=""
                      aria-hidden="true"
                    />
                    {appleLoading ? (
                      <span className="animate-pulse text-xs">
                        Connecting...
                      </span>
                    ) : (
                      <span>Apple</span>
                    )}
                  </Button>
                )}
                onSuccess={handleAppleSuccess}
                onError={(err: any) => {
                  setAppleLoading(false);
                  console.error("Apple Signup Error:", err);
                }}
              />
            </div>

            {/* Terms and Privacy Policy notice */}
            <p className="mt-6 text-center text-xs text-neutral-500 leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7141F8] hover:underline font-medium"
              >
                terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7141F8] hover:underline font-medium"
              >
                privacy policy
              </Link>
              .
            </p>
          </form>
        </div>

        {/* Bottom footer notice */}
        <div className="w-full max-w-lg mx-auto text-center text-xs text-neutral-400 py-2">
          © {new Date().getFullYear()} Zedu. All rights reserved.
        </div>
      </section>
    </main>
  );
}

export default SignUp;
