import axios from "axios";

// Isolated Axios client for public newsletter subscription.
// Kept separate from the global HTTP client to avoid global interceptor side effects
// (such as authentication-expiry redirects or token attachment) and global toast dismissals.
const newsletterClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

const GENERIC_ERROR = "Something went wrong. Please try again.";

export const ALREADY_SUBSCRIBED_MESSAGE =
  "This email is already subscribed to our newsletter.";

export type NewsletterResult = { ok: true } | { ok: false; error: string };

// Subscribes an email to the public newsletter. Shared by the footer form and
// the "Notify me" capture on /resources so both behave the same way.
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
      const status = err.response?.status;
      const body = err.response?.data;
      const isAlreadySubscribed = status === 409 || body?.status_code === 409;

      if (isAlreadySubscribed) {
        return { ok: false, error: ALREADY_SUBSCRIBED_MESSAGE };
      }

      return {
        ok: false,
        error: body?.message || err.message || GENERIC_ERROR,
      };
    }

    return { ok: false, error: GENERIC_ERROR };
  }
}
