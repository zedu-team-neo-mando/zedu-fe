import axios from "axios";

// Isolated Axios client for public newsletter subscription.
// Kept separate from the global HTTP client to avoid global interceptor side effects
// (such as authentication-expiry redirects or token attachment) and global toast dismissals.
const newsletterClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

const GENERIC_ERROR = "Something went wrong. Please try again.";

export type NewsletterResult = { ok: true } | { ok: false; error: string };

// Starts a newsletter subscription. The address only becomes subscribed once its
// owner opens the link in the confirmation email (see confirmNewsletterSubscription).
// Shared by the footer form and the "Notify me" capture on /resources so both
// behave the same way. The answer is the same for new and existing addresses.
export async function subscribeToNewsletter(
  email: string
): Promise<NewsletterResult> {
  try {
    const res = await newsletterClient.post("/newsletter", { email });

    if (res.status === 200 || res.status === 201) {
      return { ok: true };
    }

    return { ok: false, error: GENERIC_ERROR };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const body = err.response?.data;

      return {
        ok: false,
        error: body?.message || err.message || GENERIC_ERROR,
      };
    }

    return { ok: false, error: GENERIC_ERROR };
  }
}

export const INVALID_CONFIRMATION_LINK_MESSAGE =
  "This confirmation link is invalid or has expired. Sign up again to get a new one.";

// Confirms a pending newsletter subscription. The token comes from the link in
// the confirmation email, so only the owner of the inbox can confirm it.
export async function confirmNewsletterSubscription(
  email: string,
  token: string
): Promise<NewsletterResult> {
  try {
    const res = await newsletterClient.post("/newsletter/confirm", {
      email,
      token,
    });

    if (res.status === 200) {
      return { ok: true };
    }

    return { ok: false, error: GENERIC_ERROR };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 400 || status === 422) {
        return { ok: false, error: INVALID_CONFIRMATION_LINK_MESSAGE };
      }

      return { ok: false, error: err.response?.data?.message || GENERIC_ERROR };
    }

    return { ok: false, error: GENERIC_ERROR };
  }
}
