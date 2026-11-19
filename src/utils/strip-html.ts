/**
 * The plain text of an HTML string, for one-line previews: the DM list, the
 * Later list and the sidebar popouts.
 *
 * That HTML is usually someone else's message, so it must never be parsed
 * into the live page. An element made with `document.createElement` still
 * loads images and fires their event handlers once `innerHTML` is set, even
 * if it is never attached, so `<img src=x onerror=...>` in a message would
 * run in the viewer's session just by showing its preview. `DOMParser`
 * builds a separate, inert document in which nothing loads, runs or fires.
 */
export function stripHtmlTags(html: string = ""): string {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html; // SSR safety
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body?.textContent ?? "";
}
