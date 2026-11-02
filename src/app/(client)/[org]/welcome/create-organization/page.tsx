"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Loading from "~/components/ui/loading";
import { GetRequest, PostRequest, PutRequest } from "~/utils/request";
import { Country } from "country-state-city";
import CustomSelect from "~/components/ui/custom-select";
import useFirstChannel from "../../home/channels/hooks/first-channel";
import StepIndicator from "~/components/ui/step-indicator";
import { RegisterWebhookRequest } from "~/utils/webhook-request";
import { provisionTemplateChannels } from "~/data/templates";
// Direct sonner toast import because our toast wrapper does not support action buttons (e.g. "Skip template")
import { toast } from "sonner";
import { showError } from "~/components/toast/sonner";
import {
  redirectAfterOrgSwitch,
  resolveChannelIdForOrgSwitch,
} from "~/utils/org-switch";

import { isAutoCreatedOrg } from "~/utils/organisation";

const PENDING_TEMPLATE_ORG_STORAGE = "pending_org";

// initial states
const initialState = {
  organisationName: "",
  organisationType: "",
};

/**
 * Onboarding view allowing newly registered users to create their initial organization.
 * @returns Organization creation page component.
 */
const CreateOrganization: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buttonloading, setButtonloding] = useState(false);
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<any>([]);
  const [country, setCountry] = useState<any>(null);
  const { firstChannel } = useFirstChannel();
  const { org } = useParams<{ org: string }>();
  const [createdOrg, setCreatedOrg] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(PENDING_TEMPLATE_ORG_STORAGE);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const rawUser = localStorage.getItem("user");
      const currentUserId = rawUser
        ? JSON.parse(rawUser)?.user_id || JSON.parse(rawUser)?.data?.user_id
        : null;
      if (parsed?.userId && currentUserId && parsed.userId !== currentUserId) {
        sessionStorage.removeItem(PENDING_TEMPLATE_ORG_STORAGE);
        return null;
      }
      return parsed?.org || parsed;
    } catch {
      return null;
    }
  });
  const [templateProvisionFailed, setTemplateProvisionFailed] =
    useState<boolean>(() => {
      if (typeof window === "undefined") return false;
      try {
        const saved = sessionStorage.getItem(PENDING_TEMPLATE_ORG_STORAGE);
        if (!saved) return false;
        const parsed = JSON.parse(saved);
        const rawUser = localStorage.getItem("user");
        const currentUserId = rawUser
          ? JSON.parse(rawUser)?.user_id || JSON.parse(rawUser)?.data?.user_id
          : null;
        if (
          parsed?.userId &&
          currentUserId &&
          parsed.userId !== currentUserId
        ) {
          sessionStorage.removeItem(PENDING_TEMPLATE_ORG_STORAGE);
          return false;
        }
        return true;
      } catch {
        return false;
      }
    });
  const createdOrgRef = useRef<any>(createdOrg);
  const hasSentOnboardingWebhook = useRef(false);

  // check if a user is onboarded
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token") || "";
      const urlParams = new URLSearchParams(window.location.search);
      const urlTemplate = urlParams.get("template");

      let hasPendingOrg = false;
      try {
        const saved = sessionStorage.getItem(PENDING_TEMPLATE_ORG_STORAGE);
        if (saved) {
          const parsed = JSON.parse(saved);
          const rawUser = localStorage.getItem("user");
          const currentUserId = rawUser
            ? JSON.parse(rawUser)?.user_id || JSON.parse(rawUser)?.data?.user_id
            : null;
          if (
            parsed?.userId &&
            currentUserId &&
            parsed.userId !== currentUserId
          ) {
            sessionStorage.removeItem(PENDING_TEMPLATE_ORG_STORAGE);
            hasPendingOrg = false;
          } else {
            hasPendingOrg = true;
          }
        }
      } catch {
        hasPendingOrg = false;
      }

      const userstatus = await GetRequest("/auth/onboard-status", token);

      if (
        userstatus?.data?.data?.status &&
        !isAutoCreatedOrg() &&
        !urlTemplate &&
        !hasPendingOrg
      ) {
        router.push(`/${org}`);
      } else {
        setLoading(false);
      }
    })();
  }, [router, org]);

  useEffect(() => {
    const allcountries = Country.getAllCountries();
    const response = allcountries?.map((item) => ({
      label: item.name,
      value: item.name,
    }));

    setCountries(response);
  }, []);

  /**
   * Updates organization form field state on input change.
   * @param event Input change event.
   */
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  /**
   * Updates stored organization properties on the local user object.
   * @param organisation Updated organization data to merge.
   */
  const storeCurrentOrganisation = (organisation: any) => {
    if (!organisation) return;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) return;
      user.organisation = { ...user.organisation, ...organisation };
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      // A malformed stored user is replaced on the next login
    }
  };

  /**
   * Switches user context to the newly created organization and handles routing.
   * @param target Target organization record.
   * @param token Authorization bearer token.
   */
  const switchToOrganisation = async (target: any, token: string) => {
    const result = await PutRequest(
      "/users/switch-org",
      { current_org: target?.id },
      token
    );

    const slug = result?.data?.data?.current_organisation_slug;
    const switched = result?.status === 200 || result?.status === 201;

    // Without the new slug the redirect would land on the previous org.
    if (!switched || !slug) {
      if (switched)
        showError("Couldn't open your new organisation. Try again.");
      setButtonloding(false);
      return;
    }

    try {
      sessionStorage.removeItem(PENDING_TEMPLATE_ORG_STORAGE);
    } catch {
      // ignore storage cleanup failure
    }

    const organisation = result?.data?.data?.organisation;
    localStorage.setItem("token", result?.data?.data?.access_token);
    localStorage.setItem("orgId", organisation?.id || target?.id);
    localStorage.setItem("orgSlug", slug);
    // The switch response can omit fields such as type, so fall back to the created org
    storeCurrentOrganisation({ ...target, ...organisation });

    const channelId = await resolveChannelIdForOrgSwitch(
      firstChannel,
      organisation?.id || target?.id
    );

    redirectAfterOrgSwitch(slug, channelId);
  };

  /**
   * Sends the onboarding completion webhook for the created organization.
   * Ensures the webhook is dispatched at most once per onboarding session.
   * @param message Optional message from the organization creation response.
   */
  const sendOnboardingWebhook = (message?: string) => {
    if (hasSentOnboardingWebhook.current) return;
    hasSentOnboardingWebhook.current = true;

    const webhookData = `
      Organisation Name: ${values.organisationName} \n
      Organisation Type: ${values.organisationType} \n
      Country: ${country?.value || ""}
      `;
    RegisterWebhookRequest(
      webhookData,
      "User Completed Onboarding",
      message,
      "success"
    ).catch((error) => {
      hasSentOnboardingWebhook.current = false;
      console.error("Failed to send onboarding webhook", error);
    });
  };

  /**
   * Skips template provisioning, clears selected template, and switches into the created organization.
   */
  const handleSkipTemplate = async () => {
    setButtonloding(true);
    setTemplateProvisionFailed(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("selected_template");
      try {
        sessionStorage.removeItem(PENDING_TEMPLATE_ORG_STORAGE);
      } catch {
        // ignore storage cleanup failure
      }
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("template");
        window.history.replaceState({}, "", url.pathname + url.search);
      } catch {
        // ignore url cleanup failure
      }
    }
    const target = createdOrgRef.current || createdOrg;
    const token = localStorage.getItem("token") || "";
    if (!target?.id) {
      setButtonloding(false);
      return;
    }
    sendOnboardingWebhook();
    await switchToOrganisation(target, token);
  };

  /**
   * Handles form submission to create an organization and provision template channels.
   * @param event Form submission event.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("token") || "";

    setButtonloding(true);
    setTemplateProvisionFailed(false);

    const activeTemplate =
      searchParams.get("template") ||
      (typeof window !== "undefined"
        ? localStorage.getItem("selected_template")
        : null);

    if (createdOrg?.id) {
      createdOrgRef.current = createdOrg;
      let provisioned = false;
      try {
        provisioned = await provisionTemplateChannels(
          createdOrg.id,
          activeTemplate,
          token
        );
      } catch {
        provisioned = false;
      }

      if (!provisioned) {
        setTemplateProvisionFailed(true);
        toast.error("Failed to set up template channels. Please try again.", {
          action: {
            label: "Skip template",
            onClick: handleSkipTemplate,
          },
        });
        setButtonloding(false);
        return;
      }

      try {
        localStorage.removeItem("selected_template");
        sessionStorage.removeItem(PENDING_TEMPLATE_ORG_STORAGE);
      } catch {
        // ignore storage cleanup failure
      }

      sendOnboardingWebhook();
      await switchToOrganisation(createdOrg, token);
      return;
    }

    const payload = {
      name: values.organisationName,
      type: values.organisationType,
      country: country?.value,
    };

    const res = await PostRequest("/organisations", payload, token);

    if (res?.status === 200 || res?.status === 201) {
      // onboard the user
      await PutRequest("/auth/onboard-status", {}, token);

      const newOrg = res?.data?.data;
      if (newOrg?.id) {
        try {
          const rawUser = localStorage.getItem("user");
          const currentUserId = rawUser
            ? JSON.parse(rawUser)?.user_id || JSON.parse(rawUser)?.data?.user_id
            : null;
          sessionStorage.setItem(
            PENDING_TEMPLATE_ORG_STORAGE,
            JSON.stringify({ org: newOrg, userId: currentUserId })
          );
        } catch {
          // ignore storage write failure
        }
      }
      localStorage.setItem("orgId", newOrg?.id);
      setCreatedOrg(newOrg);
      createdOrgRef.current = newOrg;

      let provisioned = false;
      try {
        provisioned = await provisionTemplateChannels(
          newOrg?.id,
          activeTemplate,
          token
        );
      } catch {
        provisioned = false;
      }

      if (!provisioned) {
        setTemplateProvisionFailed(true);
        toast.error("Failed to set up template channels. Please try again.", {
          action: {
            label: "Skip template",
            onClick: handleSkipTemplate,
          },
        });
        setButtonloding(false);
        return;
      }

      try {
        localStorage.removeItem("selected_template");
        sessionStorage.removeItem(PENDING_TEMPLATE_ORG_STORAGE);
      } catch {
        // ignore storage cleanup failure
      }

      sendOnboardingWebhook(res?.data?.message);

      // Switch into the new organisation so the user lands there rather than
      // the auto-created default (pattern from organization/create/page.tsx).
      await switchToOrganisation(newOrg, token);
    } else {
      setButtonloding(false);
    }
  };

  //

  return (
    <div className="w-full h-[90dvh] mt-0">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mt-10 mb-10 mx-auto">
          <div className="flex gap-2 justify-center md:hidden mb-20">
            <Image src="/TelexIcon.svg" alt="Icon" width={40} height={40} />
            <h1 className="font-semibold text-2xl text-center flex justify-center items-center">
              Zedu
            </h1>
          </div>
        </div>

        <div className="mx-3 md:mx-10">
          {loading ? (
            <div className="w-full flex justify-center mt-20">
              <Loading width="40" height="40" color="blue" />
            </div>
          ) : (
            <div>
              <div className="my-3">
                <StepIndicator currentStep={2} totalSteps={2} />
              </div>
              <h2 className="font-semibold sm:text-3xl text-2xl text-center">
                Create Your Organisation
              </h2>
              <p className=" text-[#6E6E6F] text-md mt-4 mb-6 text-center">
                Input the details of your organisation below
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-box mb-3">
                  <label className="mb-2 block text-sm">
                    Organisation Name
                  </label>
                  <Input
                    placeholder="Enter your organisation Name"
                    className="focus:border-blue-500 py-6"
                    type="text"
                    value={values.organisationName}
                    onChange={handleChange}
                    name="organisationName"
                  />
                </div>

                <div className="form-box mb-3">
                  <label className="mb-2 block text-sm">
                    Organisation Type
                  </label>
                  <Input
                    placeholder="What does your organisation do"
                    className="focus:border-blue-500 py-6"
                    type="text"
                    value={values.organisationType}
                    onChange={handleChange}
                    name="organisationType"
                  />
                </div>

                <div className="flex flex-col sm:flex-row align-center justify-between gap-6">
                  <div className="form-box sm:mb-3 w-full">
                    <label className="mb-2 block text-sm">Country</label>

                    <CustomSelect
                      options={countries}
                      placeholder="Select an option..."
                      onChange={setCountry}
                      defaultValue={country}
                      isDisabled={false}
                    />
                  </div>
                </div>

                {templateProvisionFailed && (
                  <div className="my-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span>
                      Failed to set up template channels. Please try again.
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={buttonloading}
                      onClick={handleSkipTemplate}
                      className="shrink-0 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Skip template
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-400 font-semibold my-3 py-6 px-10 text-white"
                >
                  {buttonloading ? (
                    <span className="flex items-center gap-x-2">
                      <span className="animate-pulse">Loading...</span>{" "}
                      <Loading width="20" height="40" />
                    </span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
