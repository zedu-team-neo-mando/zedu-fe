/** Answers to "How did you hear about Zedu?", asked once during onboarding. */
export const HEARD_ABOUT_OPTIONS = [
  "A friend or colleague",
  "My school, bootcamp or cohort",
  "A WhatsApp or Telegram group",
  "X (Twitter)",
  "LinkedIn",
  "Instagram or TikTok",
  "Google or another search engine",
  "An event or webinar",
  "Something else",
].map((label) => ({ label, value: label }));

/**
 * The line added to the onboarding webhook message. The question is optional,
 * so a skipped answer is recorded as "Not answered" rather than left blank.
 */
export const heardAboutLine = (answer?: string | null): string =>
  `Heard about Zedu: ${answer?.trim() || "Not answered"}`;
