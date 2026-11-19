import { defaultSchema, type Options } from "rehype-sanitize";

// Chat messages are markdown plus the HTML the composer emits (mentions, code
// classes, emoji images). They run through rehypeRaw, so this schema decides
// what raw HTML from a sender can reach other members' browsers.
// The default schema already drops style attributes, event handlers and
// javascript: urls. We strip the content of the tags below as well, so their
// text does not leak into the message, and allow only the classes and data
// attributes the renderer styles.
export const messageSanitizeSchema: Options = {
  ...defaultSchema,
  strip: [
    ...(defaultSchema.strip ?? []),
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "meta",
    "noscript",
    "template",
    "title",
  ],
  attributes: {
    ...defaultSchema.attributes,
    // One rule per property: the sanitizer only reads the first match.
    code: [["className", /^language-./, "slack-inline-code"]],
    pre: [["className", "slack-code-block"]],
    span: [["className", "mention"], "dataType", "dataId", "dataLabel"],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ["className", "apple-emoji-img"],
    ],
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

// The schema still lets any https image through, so a sender could embed a
// remote image that tells them who opened the message and when. Run this after
// rehype-sanitize to keep only Apple emoji images served from the configured
// emoji datasource. With no datasource configured, every image is removed.
export function rehypeEmojiImagesOnly(emojiDatasourceBaseUrl: string) {
  const base = emojiDatasourceBaseUrl
    ? `${emojiDatasourceBaseUrl.replace(/\/$/, "")}/`
    : "";
  return () => (tree: HastNode) => {
    removeForeignImages(tree, base);
  };
}
