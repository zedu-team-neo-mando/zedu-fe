"use client";

import Link from "next/link";
import { campaignPayload } from "~/lib/campaign-attribution";
import { Checkbox } from "~/components/ui/checkbox";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "~/components/ui/toaster";
import { showError } from "~/components/toast/sonner";
import { PostRequest } from "~/utils/request";
import Loading from "~/components/ui/loading";
import { LoginWebhookRequest } from "~/utils/webhook-request";
import { getSafeRedirect } from "~/utils/safe-redirect";
import { useGoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-signin-auth";
import { Eye, EyeOff, Mail } from "lucide-react";
import { getLoggedInRedirectPath } from "~/app/(auth)/layout";
import { AuthWorkspacePanel } from "~/app/(auth)/_components/auth-workspace-panel";

function resolvePostLoginRedirect(orgSlug?: string, user?: any): string {
  let selectedTemplate: string | null = null;
  try {
    selectedTemplate = localStorage.getItem("selected_template");
    if (selectedTemplate) {
      localStorage.removeItem("selected_template");
    }
  } catch {
    // ignore storage access errors
  }
  const redirectPath = getLoggedInRedirectPath(orgSlug, selectedTemplate);
  if (redirectPath) return redirectPath;
  return user?.is_onboarded ? `/${orgSlug}` : `/${orgSlug}/welcome`;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleloading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLaunchAssessment = React.useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isAssessmentMode", "true");
      localStorage.setItem("enableTestNotifications", "true");
      localStorage.setItem("token", "demo-assessment-token");
      localStorage.setItem("orgId", "demo-assessment-org-id");
      localStorage.setItem("orgSlug", "demo");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "reviewer-id",
          first_name: "Reviewer",
          last_name: "Assessor",
          email: "reviewer@zedu.chat",
          role: "admin",
          default_avatar_url: "/image/avatar.png",
        })
      );
    }
    router.push("/demo?assessment=true");
  }, [router]);

  useEffect(() => {
    const isAssessment =
      searchParams.get("assessment") === "true" ||
      searchParams.get("demo") === "true";
    if (isAssessment) {
      handleLaunchAssessment();
    }
  }, [searchParams, handleLaunchAssessment]);

  useEffect(() => {
    const inviteEmail = searchParams.get("email");
    if (inviteEmail) {
      setEmail(inviteEmail.trim());
    }
    const savedRememberMe = localStorage.getItem("rememberMe");
    if (savedRememberMe === "true") {
      setRememberMe(true);
    }
  }, [searchParams]);

  // Apple Login handler
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
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
        const orgSlug = res.data.data.user.current_organisation_slug;
        if (orgSlug) {
          localStorage.setItem("orgSlug", orgSlug);
        }
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(resolvePostLoginRedirect(orgSlug, user));
        }
        const message = `\nName: ${user?.username}\nEmail: ${user?.email}`;
        await LoginWebhookRequest(
          user?.username,
          "User Login Detected (Apple)",
          message.trim(),
          "success",
          user?.avatar_url
        );
      }
    } catch (err) {
      console.error("Apple Login Error:", err);
    } finally {
      setAppleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (trimmedEmail !== email) {
      setEmail(trimmedEmail);
    }

    if (validateForm()) {
      setLoading(true);

      const payload = {
        email: trimmedEmail,
        password,
      };

      const redirectUrl = getSafeRedirect(searchParams.get("redirect"));
      const coworkerId = searchParams.get("coworkerId") || "";

      const res = await PostRequest("/auth/login", payload);

      if (res?.status === 200 || res?.status === 201) {
        localStorage.setItem("token", res?.data?.data?.access_token);
        localStorage.setItem("useremail", res?.data?.data?.user?.email);
        localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
        localStorage.setItem("orgId", res?.data?.data?.user?.current_org);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

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
            router.push(
              resolvePostLoginRedirect(orgSlug, res?.data?.data?.user)
            );
          }, 100);
        }

        const user = res?.data?.data?.user;
        const message = `
            Name: ${user?.username}\n
            Email: ${user?.email}
            `;

        await LoginWebhookRequest(
          user?.username,
          "User Login Detected",
          message.trim(),
          "success",
          user?.avatar_url
        );
      } else {
        setLoading(false);
        LoginWebhookRequest(
          trimmedEmail,
          "New User Login",
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
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }
          const orgSlug = res.data.data.user.current_organisation_slug;
          if (orgSlug) {
            localStorage.setItem("orgSlug", orgSlug);
          }

          if (redirectUrl) {
            router.push(redirectUrl);
          } else {
            router.push(resolvePostLoginRedirect(orgSlug, user));
          }

          const message = `
            Name: ${user?.username}\n
            Email: ${user?.email}
            `;

          await LoginWebhookRequest(
            user?.username,
            "User Login Detected",
            message.trim(),
            "success",
            user?.avatar_url
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
      console.error("Google Login Failed:", error);
      if (error.error !== "access_denied") {
        showError(
          "Google sign-in failed",
          "Try again, or use email and password instead."
        );
      }
    },
    onNonOAuthError: (error) => {
      setGoogleloading(false);
      console.error("Google Login Failed:", error);
      if (error.type === "popup_failed_to_open") {
        showError(
          "Google sign-in failed",
          "Allow pop-ups for this site, then try again."
        );
      }
    },
  });

  return (
    <>
      <Toaster />
      <main className="w-full min-h-screen flex bg-white text-neutral-900">
        {/* Modern Workspace Left Brand Panel */}
        <AuthWorkspacePanel
          title="Your team has been busy."
          subtitle="12 new messages are waiting for you in 3 channels."
          channelName="#team-flamingo"
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
              New to Zedu?{" "}
              <Link
                href="/auth/sign-up"
                className="text-[#7141F8] font-semibold hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8]"
              >
                Create an account
              </Link>
            </div>
          </header>

          {/* Center Form */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-neutral-500">
                Log in to catch up with your team.
              </p>
            </div>

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
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-semibold text-[#7141F8] hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      className={`w-full h-11 px-3.5 pr-11 rounded-lg border text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/50 hover:bg-white focus:bg-white transition-all outline-none ${
                        errors.password
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
                  {errors.password && (
                    <small
                      id="password-error"
                      role="alert"
                      aria-live="assertive"
                      className="block mt-1 text-xs text-[#F81404] font-medium"
                    >
                      {errors.password}
                    </small>
                  )}
                </div>

                {/* Keep me logged in */}
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="remember-me"
                    name="remember-me"
                    aria-label="Keep me logged in"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    className="border-neutral-300 rounded data-[state=checked]:bg-[#7141F8] data-[state=checked]:border-[#7141F8] focus-visible:ring-[#7141F8]"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium text-neutral-700 cursor-pointer select-none"
                  >
                    Keep me logged in
                  </label>
                </div>
              </div>

              {/* Primary Log in Button */}
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={googleloading || appleLoading || loading}
                  aria-label="Log in"
                  aria-busy={loading}
                  className="w-full h-11 rounded-lg bg-[#7141F8] hover:bg-[#5f30e6] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-x-2">
                      <span className="animate-pulse">Logging in...</span>
                      <Loading width="18" height="18" />
                    </span>
                  ) : (
                    <span>Log in</span>
                  )}
                </Button>
                <div role="status" aria-live="polite" className="sr-only">
                  {loading ? "Logging in..." : ""}
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

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google Login */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => login()}
                  disabled={googleloading || appleLoading}
                  aria-label="Sign in with Google"
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

                {/* Apple Login */}
                <AppleSignin
                  authOptions={{
                    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
                    scope: "email name",
                    redirectURI:
                      typeof window !== "undefined"
                        ? window.location.origin
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
                      aria-label="Sign in with Apple"
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
                    console.error("Apple Login Error:", err);
                  }}
                />
              </div>

              {/* Magic Link */}
              <Link
                href="/auth/magiclink"
                className="w-full h-11 mt-3 border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Mail size={16} className="text-neutral-500" />
                <span>Email me a login link</span>
              </Link>

              {/* Demo Mode for Reviewers & Testing */}
              <div className="pt-4 mt-6 border-t border-neutral-100 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={handleLaunchAssessment}
                  className="w-full py-2 px-3 rounded-lg border border-dashed border-[#7141F8]/50 bg-violet-50/60 hover:bg-violet-50 text-[#7141F8] text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🚀 Launch Assessment Workspace (Demo Mode)</span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center">
                  For automated assessment of workspace features without
                  credentials
                </p>
              </div>
            </form>
          </div>

          {/* Bottom spacer for balance */}
          <div className="w-full max-w-lg mx-auto text-center text-xs text-neutral-400 py-2">
            © {new Date().getFullYear()} Zedu. All rights reserved.
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;
