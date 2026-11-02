"use client";
import React, { useContext, useState } from "react";
import SettingsLabel from "../../../components/settings-label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Check, CircleCheckBig } from "lucide-react";
import { Button } from "~/components/ui/button";
import BillingCancellationModal from "../components/billing-cancellation-modal";
import {
  subscriptionPlanUtils,
  useGetCurrentSubscription,
  normalizeSubscriptionPlans,
  getPlanBenefits,
} from "~/utils/subscriptionPlans";
import { DeleteRequest, PostRequest, PutRequest } from "~/utils/new-request";
import { DataContext } from "~/store/GlobalState";
import { showError, showSuccess } from "~/components/toast/sonner";
import Loading from "~/components/ui/loading";
import { useSubscriptionPlans } from "~/hooks/useSubscriptionPlans";
import { useRBAC } from "~/hooks/useRBAC";

const Page = () => {
  const { subscriptionPlans, isLoading: plansLoading } = useSubscriptionPlans();
  const [loadingPlan, setLoadingPlan] = useState<string>("");
  const [isBillingCancellationModalOpen, setIsBillingCancellationModalOpen] =
    useState(false);
  const [isUnSubscribing, setIsUnSubscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentSubscription } = useGetCurrentSubscription();

  const { state } = useContext(DataContext);
  const { orgData, orgSlug, user } = state;
  const { hasPermission } = useRBAC();
  const canManageBilling = hasPermission("manage:billing");

  const orgId = orgData?.id;
  const email = orgData?.email;

  const PLAN_ACCENT_COLORS: Record<string, string> = {
    Free: "bg-[#94A3B8]",
    Pro: "bg-[#10B981]",
    "Pro Plus": "bg-[#F59E0B]",
    Business: "bg-[#7A5AF8]",
    Enterprise: "bg-[#2D9CDB]",
  };

  const handleUpgrade = async (planName: string) => {
    try {
      if (orgData?.subscription_plan_id === "free") {
        await PostRequest(`/subscriptions/create`, {
          plan_name: planName,
          org_id: orgId || "",
          email,
        })
          .then((res) => {
            if (res?.data?.data?.checkout_session_url) {
              window.location.href = res?.data?.data?.checkout_session_url;
            }
          })
          .catch((err) => {
            showError(
              `${
                err.response?.data?.message ||
                "An error occurred during upgrade."
              } Please try again.`
            );
            throw err;
          });
      } else {
        await PutRequest(`/subscriptions/modify`, {
          plan_name: planName,
          org_id: orgId || "",
        })
          .then((res) => {
            if (res?.data?.data?.checkout_session_url) {
              window.location.href = res?.data?.data?.checkout_session_url;
            }
          })
          .catch((err) => {
            showError(
              `${
                err.response?.data?.message ||
                "An error occurred during upgrade."
              } Please try again.`
            );
            throw err;
          });
      }
    } catch (error) {
      showError("An error occurred during upgrade. Please try again.");
    } finally {
      setLoadingPlan("");
    }
  };

  const handleSubscription = async (id: string) => {
    setIsLoading(true);
    setLoadingPlan(id);

    const payload = {
      plan_id: id,
      org_id: orgData?.id,
      email: user?.email,
    };

    const res = await PostRequest("/subscriptions/create", payload);
    if (res?.status === 200 || res?.status === 201) {
      window.location.href = res?.data?.data?.checkout_session_url;
    }

    setIsLoading(false);
  };

  // Show loading state while plans are being fetched
  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SettingsLabel />
        <div className="p-5 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${orgSlug}/settings/organisation/billing`}
                >
                  Billing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-black">
                  All Plans
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loading color="blue" />
          <span className="ml-2 text-gray-500">
            Loading subscription plans...
          </span>
        </div>
      </div>
    );
  }

  if (!subscriptionPlans) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SettingsLabel />
        <div className="p-5 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${orgSlug}/settings/organisation/billing`}
                >
                  Billing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-black">
                  All Plans
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            Unable to load subscription plans. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Sort plans for display
  const sortedPlans = subscriptionPlanUtils.sortPlansByPrice(
    normalizeSubscriptionPlans(subscriptionPlans)
  );

  return (
    <div>
      <BillingCancellationModal
        isOpen={isBillingCancellationModalOpen}
        onClose={() => setIsBillingCancellationModalOpen(false)}
        onCancel={async (password, isAdmin) => {
          setIsUnSubscribing(true);
          await DeleteRequest(`/subscriptions/${orgId}`).then((res) => {
            if (res?.status === 200 || res?.status === 201) {
              showSuccess(res?.data?.message);
              window.location.href = `/${orgSlug}/settings/organisation/billing`;
            }
          });
        }}
        isUnSubscribing={isUnSubscribing}
      />

      <div className="p-5 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/${orgSlug}/settings/organisation/billing`}
              >
                Billing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-black">All Plans</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Responsive plan layout: mobile scroll, desktop grid */}
      <div className="relative overflow-x-auto px-6 py-3 lg:px-3 lg:py-1.5">
        <div className="pb-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3 lg:gap-1">
            {sortedPlans.map((plan, index) => {
              const subscriptionName = currentSubscription?.name
                ? currentSubscription.name
                : "Free";
              const isCurrentPlan = plan.name === subscriptionName;
              const isLoading = loadingPlan === plan.id;
              const accentColorClass =
                PLAN_ACCENT_COLORS[plan.name] || "bg-[#6B7280]";
              const planFeatures = getPlanBenefits(plan);

              return (
                <div
                  key={`${plan.name}-${index}`}
                  className="min-w-[300px] h-full"
                >
                  <div className="group relative p-2 rounded-2xl transition-all duration-100 h-full ">
                    <div
                      className={`
                          relative overflow-hidden rounded-2xl border-[#E6EAEF] bg-[#F6F7F6] border transition-all duration-300 h-full
                          ${isCurrentPlan ? "shadow-md" : " shadow-sm "}
                        `}
                    >
                      <div
                        className={`pointer-events-none absolute z-0 inset-x-0 top-0 h-[20px] ${accentColorClass}`}
                      />
                      <div className="relative z-10 flex items-start justify-between px-6 pt-6 bg-white rounded-t-2xl mt-[3px]">
                        <div className="">
                          <h3 className="text-xl font-bold text-[#101828]">
                            {plan.name}
                          </h3>
                          <p className="text-[#344054] text-sm">
                            {plan.description}
                          </p>
                        </div>

                        {isCurrentPlan && (
                          <div className="">
                            <div className="flex items-center gap-2 bg-gradient-to-b from-white to-[#F2EFFA] text-purple-700 px-3 py-2 border border-[#F1F1FE] rounded-full text-sm font-medium dark:from-[#2C2D30] dark:to-[#2D2463] dark:text-purple-200 dark:border-white/10">
                              <Check size={16} />
                              Current Plan
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 px-6 py-6 bg-white border-b border-[#EAECF0]">
                        <div className="flex items-center gap-1">
                          <span className="text-3xl font-semibold text-black">
                            ₦
                            {plan.fee === 0
                              ? "0"
                              : `${plan.fee.toLocaleString()}K`}
                          </span>
                          <span className="text-[#344054] self-end">
                            per month
                          </span>
                        </div>
                        {typeof plan.credits === "number" &&
                          plan.credits > 0 && (
                            <p className="text-sm text-[#667085] mt-1">
                              {plan.credits.toLocaleString()} AI Credits
                              included
                            </p>
                          )}
                      </div>

                      <div className="relative z-10">
                        <div className="bg-[#F9FAFB] px-6 py-2.5">
                          <h4 className="text-[#111827] dark:text-zinc-100">
                            Includes:
                          </h4>
                        </div>
                        <ul className="space-y-4 p-6 bg-white min-h-[230px]">
                          {planFeatures.map(
                            (feature: string, featureIndex: number) => (
                              <li
                                key={featureIndex}
                                className="flex items-center gap-3"
                              >
                                <div className="">
                                  <CircleCheckBig size={18} color="#7A5AF8" />
                                </div>
                                <span className="text-[#1F2937] leading-relaxed text-sm">
                                  {feature}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="relative z-10 mt-auto flex w-full items-center justify-center gap-3 border-t border-[#EAECF0] px-5 py-4 bg-[#F6F7F6]">
                        {canManageBilling &&
                        subscriptionName !== "Free" &&
                        isCurrentPlan ? (
                          <Button
                            variant={"outline"}
                            className="w-full rounded-xl border border-[#D92D20] bg-white px-6 py-6 text-center font-semibold text-[#D92D20] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => {
                              setIsBillingCancellationModalOpen(true);
                            }}
                            disabled={isLoading || loadingPlan !== ""}
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loading />
                                <span>Cancelling...</span>
                              </div>
                            ) : (
                              "Cancel Subscription"
                            )}
                          </Button>
                        ) : canManageBilling &&
                          subscriptionPlanUtils.getPlanTierIndex(
                            subscriptionName
                          ) >
                            subscriptionPlanUtils.getPlanTierIndex(plan.name) &&
                          plan.name !== "Free" ? (
                          <div>
                            <Button
                              className="w-full rounded-xl border border-[#6941C6] bg-white px-6 py-6 text-center font-semibold text-[#6941C6] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F8F7FF] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() => {
                                handleUpgrade(plan.name);
                              }}
                              disabled={isLoading || loadingPlan !== ""}
                            >
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <Loading />
                                  <span>Downgrading...</span>
                                </div>
                              ) : (
                                `Downgrade to Zedu ${plan.name}`
                              )}
                            </Button>
                          </div>
                        ) : canManageBilling &&
                          plan.fee > 0 &&
                          plan.name !== currentSubscription?.name ? (
                          <Button
                            className="w-full rounded-xl bg-gradient-to-b from-[#7A5AF8] to-[#6938EF] px-6 py-6 text-center font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handleSubscription(plan.id)}
                            disabled={isLoading || loadingPlan !== ""}
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loading />
                                <span>Upgrading...</span>
                              </div>
                            ) : (
                              `Upgrade to Zedu ${plan.name}`
                            )}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
