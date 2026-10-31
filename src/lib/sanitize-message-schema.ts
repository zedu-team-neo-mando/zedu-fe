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
