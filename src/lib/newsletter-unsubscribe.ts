import axios from "axios";
import type { NewsletterResult } from "~/lib/newsletter";

// Isolated Axios client, like the one in newsletter.ts, so the global HTTP
// client's interceptors (auth redirects, token attachment, toasts) never run
// for this public link.
const unsubscribeClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

const GENERIC_ERROR = "Something went wrong. Please try again.";

export const INVALID_UNSUBSCRIBE_LINK_MESSAGE =
  "This unsubscribe link is invalid or has expired. Use the link in your most recent newsletter email.";

// Removes an email from the public newsletter. The token comes from the link in
// the newsletter email, so only the owner of the inbox can unsubscribe it.
export async function unsubscribeFromNewsletter(
  email: string,
  token: string
): Promise<NewsletterResult> {
  try {
    const res = await unsubscribeClient.post("/newsletter/unsubscribe", {
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
        return { ok: false, error: INVALID_UNSUBSCRIBE_LINK_MESSAGE };
      }

      return { ok: false, error: err.response?.data?.message || GENERIC_ERROR };
    }

    return { ok: false, error: GENERIC_ERROR };
  }
}
