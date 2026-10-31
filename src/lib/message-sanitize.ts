import { defaultSchema } from "rehype-sanitize";
import type { Options as SanitizeSchema } from "rehype-sanitize";

/**
 * Allowlist for chat message HTML rendered through `rehype-raw`.
 *
 * Message text is stored as the editor's HTML (TipTap `getHTML()`), so it can
 * contain anything a sender pastes or sends through the API. This schema keeps
 * the markup the composer and markdown produce (formatting, lists, quotes,
 * code, tables, links, mentions, Apple emoji images) and drops everything that
 * can execute or restyle the app: `script`, `iframe`, `object`, `embed`,
 * `form`, `style`, `meta`, `style=` and event-handler attributes, and
 * `javascript:` URLs.
 */
export const messageSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
    code: [["className", /^language-./, "slack-inline-code"]],
    pre: [["className", "slack-code-block"]],
    ul: [["className", "contains-task-list", "message-editor-bullet-list"]],
    ol: [["className", "contains-task-list", "message-editor-ordered-list"]],
    li: [["className", "task-list-item", "message-editor-list-item"]],
    span: [
      ["className", "mention"],
      ["dataType", "mention"],
      "dataId",
      "dataLabel",
      "dataMentionSuggestionChar",
    ],
    img: [["className", "apple-emoji-img"], "alt", "src"],
  },
};

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function isEmojiImage(node: HastNode, emojiBaseUrl: string): boolean {
  const className = node.properties?.className;
  const src = node.properties?.src;
  return (
    emojiBaseUrl !== "" &&
    Array.isArray(className) &&
    className.includes("apple-emoji-img") &&
    typeof src === "string" &&
    src.startsWith(emojiBaseUrl)
  );
}

function removeForeignImages(node: HastNode, emojiBaseUrl: string): void {
  if (!node.children) return;
  node.children = node.children.filter(
    (child) =>
      !(child.type === "element" && child.tagName === "img") ||
      isEmojiImage(child, emojiBaseUrl)
  );
  node.children.forEach((child) => removeForeignImages(child, emojiBaseUrl));
}

/**
 * Rehype plugin to run after `rehype-sanitize`: keeps an `<img>` only when it
 * is an Apple emoji served from the configured emoji datasource, so a message
 * can't embed remote images that track who views it. With no datasource
 * configured, every image is removed.
 */
export function rehypeEmojiImagesOnly(emojiDatasourceBaseUrl: string) {
  const base = emojiDatasourceBaseUrl
    ? `${emojiDatasourceBaseUrl.replace(/\/$/, "")}/`
    : "";
  return () => (tree: HastNode) => {
    removeForeignImages(tree, base);
  };
}
