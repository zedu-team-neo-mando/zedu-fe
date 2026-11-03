"use client";

import Link from "next/link";
import { campaignPayload } from "~/lib/campaign-attribution";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validateForm()) {
      setLoading(true);
      const redirectUrl = getSafeRedirect(searchParams.get("redirect"));
      const coworkerId = searchParams.get("coworkerId");

      const trimmedEmail = email.trim();
      const res = await PostRequest("/auth/register", {
        email: trimmedEmail,
        password,
        ...campaignPayload(),
      });

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
            router.push(toWelcome(orgSlug));
          }, 100);
        }

        const user = res?.data?.data?.user;
        const message = `
            Name: ${user?.username}\n
            Email: ${user?.email}
            `;

        await RegisterWebhookRequest(
          user?.username,
          "User Registration",
          message.trim(),
          "success"
        );
      } else {
        setLoading(false);
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

          const message = `
            Name: ${user?.username}\n
            Email: ${user?.email}
            `;

          await RegisterWebhookRequest(
            user?.username,
            "User Registration (Google)",
            message.trim(),
            "success"
          );
        }
      } catch (err) {
        console.error("Google Signup Error:", err);
      } finally {
        setGoogleloading(false);
      }
    },
    onError: (error) => {
      setGoogleloading(false);
      console.error("Google Signup Failed:", error);
      if (error.error !== "access_denied") {
        showError(
          "Google sign-up failed",
          "Try again, or use email and password instead."
        );
      }
    },
    onNonOAuthError: (error) => {
      setGoogleloading(false);
      console.error("Google Signup Failed:", error);
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
      {/* Left Side: Modern Workspace Ambient Panel */}
      <AuthWorkspacePanel
        title="Your team has been busy."
        subtitle="12 new messages are waiting for you in 3 channels."
        channelName="#team-flamingo"
      />

      {/* Right Side: Auth Form Container */}
      <section className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white overflow-y-auto">
        {/* Header Row: Brand Logo & Navigation */}
        <div className="flex items-center justify-between w-full">
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
          <div className="text-xs sm:text-sm text-[#475467]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#7141F8] font-semibold hover:text-[#5f30e6] hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8]"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Form Content */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101828]">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[#475467]">
              Get started with your team workspace on Zedu.
            </p>
          </div>

          {refParam && (
            <div
              data-testid="signup-referral-banner"
              className="w-full mb-5 flex items-center gap-2.5 rounded-xl bg-[#F4F3FF] border border-[#D0D0FD] px-4 py-3 text-xs text-[#5925DC] shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-[#7141F8] shrink-0" />
              <span>
                Invited by <strong>@{refParam}</strong>! Complete sign-up to
                unlock your 100 starter point bonus.
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
            aria-label="Sign up form"
          >
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#344054] mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="name@company.com"
                aria-invalid={Boolean(formSubmitted && errors.email)}
                aria-describedby={
                  formSubmitted && errors.email ? "email-error" : undefined
                }
                className={`w-full h-11 px-3.5 rounded-lg border text-sm text-[#101828] placeholder:text-[#98A2B3] bg-white transition-all outline-none ${
                  formSubmitted && errors.email
                    ? "border-[#F04438] ring-1 ring-[#F04438]"
                    : "border-[#D0D5DD] focus:border-[#7141F8] focus:ring-2 focus:ring-[#7141F8]/15"
                }`}
              />
              {formSubmitted && errors.email && (
                <small
                  id="email-error"
                  role="alert"
                  aria-live="assertive"
                  className="block mt-1.5 text-xs text-[#D92D20] font-medium"
                >
                  {errors.email}
                </small>
              )}
            </div>

            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#344054] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={Boolean(formSubmitted && errors.password)}
                  aria-describedby="password-help"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Create a password"
                  className={`w-full h-11 px-3.5 pr-11 rounded-lg border text-sm text-[#101828] placeholder:text-[#98A2B3] bg-white transition-all outline-none ${
                    formSubmitted && errors.password
                      ? "border-[#F04438] ring-1 ring-[#F04438]"
                      : "border-[#D0D5DD] focus:border-[#7141F8] focus:ring-2 focus:ring-[#7141F8]/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-[#98A2B3] hover:text-[#475467] rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-controls="password"
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formSubmitted && errors.password ? (
                <small
                  id="password-error"
                  role="alert"
                  aria-live="assertive"
                  className="block mt-1.5 text-xs text-[#D92D20] font-medium"
                >
                  {errors.password}
                </small>
              ) : (
                <small
                  id="password-help"
                  className={`block mt-1.5 text-xs transition-opacity duration-150 ${
                    passwordFocused
                      ? "text-[#7141F8] font-medium"
                      : "text-[#667085]"
                  }`}
                >
                  {PASSWORD_HINT}
                </small>
              )}
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              variant="default"
              disabled={googleloading || appleLoading || loading}
              aria-label="Create account"
              aria-busy={loading}
              className="w-full h-11 mt-1 bg-[#7141F8] hover:bg-[#5f30e6] active:bg-[#5022d4] text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Creating account...</span>
                  <Loading width="18" height="18" color="#ffffff" />
                </span>
              ) : (
                <span>Create account</span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EAECF0]" />
              </div>
              <span className="relative bg-white px-3 text-xs text-[#667085] lowercase">
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
                className="w-full h-11 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] font-medium text-sm rounded-lg flex items-center justify-center gap-2.5 shadow-xs transition-colors"
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
                    className="w-full h-11 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] font-medium text-sm rounded-lg flex items-center justify-center gap-2.5 shadow-xs transition-colors"
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
            <p className="mt-5 text-center text-xs text-[#667085] leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7141F8] hover:text-[#5f30e6] font-medium underline underline-offset-2"
              >
                terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7141F8] hover:text-[#5f30e6] font-medium underline underline-offset-2"
              >
                privacy policy
              </Link>
              .
            </p>
          </form>
        </div>

        {/* Footer */}
        <footer className="w-full py-2 text-center text-xs text-[#667085]">
          © {new Date().getFullYear()} Zedu. All rights reserved.
        </footer>
      </section>
    </main>
  );
}

export default SignUp;
