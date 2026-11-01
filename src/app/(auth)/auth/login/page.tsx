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
import { Separator } from "~/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { getLoggedInRedirectPath } from "~/app/(auth)/layout";

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

//

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
        const message = `\nName: ${user?.username}\\nEmail: ${user?.email}`;
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
          // If there's a coworkerId, append it to the redirect URL
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
        // after successful login call this endpoint
        const message = `
            Name: ${user?.username}\\n
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
            Name: ${user?.username}\\n
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

  //

  return (
    <>
      <Toaster />
      <main className="w-full min-h-screen flex flex-col  items-center ">
        <div className="flex items-center justify-between w-full py-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Zedu home"
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
          >
            <Image src="/Zedu.png" alt="Zedu home" width={86} height={31} />
          </Link>
          <div>
            Don't have an account?{" "}
            <Link
              href={"/auth/sign-up"}
              className="text-[#7141F8] hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
            >
              Sign up
            </Link>
          </div>
        </div>

        <section className="w-full md:w-[55%] flex flex-col max-w-xs md:max-w-lg mx-auto items-start justify-start pt-[20px] md:pt-0">
          <div className="w-full flex flex-col justify-center mt-[60px] md:mt-[80px] items-center gap-[8px] mb-[32px]">
            <h1 className="w-full text-center text-[24px] md:text-[28px] font-[600] leading-[30px] md:leading-[35px]">
              Log in to Zedu
            </h1>
            <p className="w-full text-center text-[14px] md:text-[16px] text-[#344054] font-[400] leading-[21px] md:leading-[27px]">
              Welcome back! We&apos;ve missed you!
            </p>
          </div>

          <div className="flex flex-col gap-[10px] w-full mt-4">
            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={() => login()}
              disabled={googleloading || appleLoading}
              aria-label="Sign in with Google"
              aria-busy={googleloading}
              className="w-full h-auto py-[11px] border border-[#D0D0FD] rounded-md justify-center gap-[10px] bg-white text-[#101828] hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-2 font-[600] text-[16px] leading-[20.16px]"
            >
              <Image
                src="/dashboard/google.svg"
                width={24}
                height={24}
                alt=""
                aria-hidden="true"
              />
              {googleloading ? (
                <span className="flex items-center gap-x-2">
                  <span className="animate-pulse">Logging in...</span>
                  <Loading width="20" height="20" color="#7141F8" />
                </span>
              ) : (
                "Sign in with Google"
              )}
            </Button>
            <div role="status" aria-live="polite" className="sr-only">
              {googleloading ? "Logging in with Google..." : ""}
            </div>
            {/* Apple Login */}
            <AppleSignin
              authOptions={{
                clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
                scope: "email name",
                redirectURI:
                  typeof window !== "undefined" ? window.location.origin : "",
                usePopup: true,
              }}
              uiType="dark"
              noDefaultStyle={true}
              render={(props: { onClick: (e?: React.MouseEvent) => void }) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={props.onClick}
                  disabled={appleLoading || googleloading}
                  aria-label="Sign in with Apple"
                  aria-busy={appleLoading}
                  className="w-full h-auto py-[11px] border border-[#D0D0FD] rounded-md justify-center gap-[10px] bg-white text-[#101828] hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-[600] text-[16px] leading-[20.16px]"
                >
                  <Image
                    src="/dashboard/apple.png"
                    width={24}
                    height={24}
                    alt=""
                    aria-hidden="true"
                  />
                  {appleLoading ? (
                    <span className="flex items-center gap-x-2">
                      <span className="animate-pulse">Logging in...</span>
                      <Loading width="20" height="20" color="#000" />
                    </span>
                  ) : (
                    "Sign in with Apple"
                  )}
                </Button>
              )}
              onSuccess={handleAppleSuccess}
              onError={(err: any) => {
                setAppleLoading(false);
                console.error("Apple Login Error:", err);
              }}
            />
            <div role="status" aria-live="polite" className="sr-only">
              {appleLoading ? "Logging in with Apple..." : ""}
            </div>
          </div>
          <div className="w-full flex justify-center items-center my-5">
            <div className="flex items-center justify-center gap-3 max-w-xl w-1/5">
              <Separator />
              <p>OR</p>
              <Separator />
            </div>
          </div>
          <form onSubmit={handleSubmit} noValidate className="w-full">
            <div className="flex flex-col gap-[16px]">
              <div className="w-full flex flex-col gap-[8px] relative">
                <label
                  htmlFor="email"
                  className="text-[14px] font-[400] leading-[21px]"
                >
                  Email address
                </label>
                <div className="w-full flex flex-col gap-[2px]">
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
                    placeholder="Enter your email"
                    className={`w-full text-[14px] text-[#667085] leading-[15.12px] font-[500] h-[48px] border ${
                      errors.email ? "border-[#F81404]" : "border-[#D0D0FD]"
                    } outline-none rounded-md py-[13px] pl-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2`}
                  />
                  {errors.email && (
                    <small
                      id="email-error"
                      role="alert"
                      aria-live="assertive"
                      className="text-[12px] text-[#F81404]"
                    >
                      {errors.email}
                    </small>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col gap-[8px] relative">
                <label
                  htmlFor="password"
                  className="text-[14px] font-[400] leading-[21px]"
                >
                  Password
                </label>
                <div className="w-full flex flex-col gap-[2px]">
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
                      placeholder="Password"
                      className={`w-full text-[14px] text-[#667085] leading-[15.12px] font-[500] h-[48px] border ${
                        errors.password
                          ? "border-[#F81404]"
                          : "border-[#D0D0FD]"
                      } outline-none rounded-md py-[13px] pl-[13px] pr-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#667085] hover:text-[#101828] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-1"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-controls="password"
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <small
                      id="password-error"
                      role="alert"
                      aria-live="assertive"
                      className="text-[12px] text-[#F81404]"
                    >
                      {errors.password}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-[10px] flex justify-between items-center mb-[32px]">
              <div className="flex items-center -ml-2">
                <div className="relative flex items-center justify-center min-h-[44px] min-w-[44px]">
                  <Checkbox
                    id="remember-me"
                    name="remember-me"
                    aria-label="Remember me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    className="relative z-10 before:content-[''] before:absolute before:-inset-3 before:min-w-[44px] before:min-h-[44px] before:cursor-pointer border-[#D0D0FD] data-[state=checked]:bg-[#7141F8] data-[state=checked]:border-[#7141F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
                  />
                </div>
                <label
                  htmlFor="remember-me"
                  className="flex items-center min-h-[44px] text-[14px] font-[500] leading-[17.64px] text-[#344054] cursor-pointer select-none py-2"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-[14px] font-[500] leading-[21px] text-[#101828] hover:text-[#7141F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2 rounded"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[16px]">
                <Button
                  type="submit"
                  variant="default"
                  className="py-6 bg-[#7141F8] hover:bg-[#8760f8] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2"
                  disabled={googleloading || appleLoading || loading}
                  aria-label="Log in"
                  aria-busy={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-x-2">
                      <span className="animate-pulse">Logging in...</span>{" "}
                      <Loading width="20" height="40" />
                    </span>
                  ) : (
                    <span>Log in</span>
                  )}
                </Button>
                <div role="status" aria-live="polite" className="sr-only">
                  {loading ? "Logging in..." : ""}
                </div>

                <Link
                  href="/auth/magiclink"
                  className="w-fit text-left text-[14px] font-[500] text-[#7141F8] hover:text-[#5a32c7] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7141F8] focus-visible:ring-offset-2 rounded py-2"
                >
                  Log in with magic link
                </Link>
              </div>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default Login;
