/**
 * True for an address with a name, one "@" and a domain made of at least two
 * dot-separated labels. Each label is letters, digits and dashes only, and
 * must not be empty or start or end with a dash, so "a@b..c", "a@..b",
 * "a@-.-" and "a@exa!mple.com" are rejected. Shared by the invite forms and
 * the footer newsletter box.
 */
export const isValidEmail = (email: string): boolean => {
  if (!/^[^\s@]+@[^\s@]+$/.test(email)) return false;
  const labels = email.slice(email.indexOf("@") + 1).split(".");
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        /^[A-Za-z0-9-]+$/.test(label) &&
        !label.startsWith("-") &&
        !label.endsWith("-")
    )
  );
};
