import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import ts from "typescript";

// Node 20 cannot import a .ts file directly, so compile the schema first.
// A module loaded from a data: URL cannot import a package by name, so the
// import of rehype-sanitize is pointed at its full path.
const source = readFileSync(
  new URL("./sanitize-message-schema.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const compiled = outputText.replace(
  /from\s+["']rehype-sanitize["']/,
  `from ${JSON.stringify(import.meta.resolve("rehype-sanitize"))}`
);
const encoded = Buffer.from(compiled).toString("base64");
const { messageSanitizeSchema } = await import(
  `data:text/javascript;base64,${encoded}`
);

// Attack payloads and sample markup live in a JSON file next to this test.
const fixtures = JSON.parse(
  readFileSync(
    new URL("./sanitize-message-schema.fixtures.json", import.meta.url),
    "utf8"
  )
);

const render = (markdown) =>
  renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeRaw, [rehypeSanitize, messageSanitizeSchema]],
      },
      markdown
    )
  );

test("drops an iframe with a script srcdoc", () => {
  const html = render(fixtures.iframeSrcdoc);
  assert.doesNotMatch(html, /iframe/i);
  assert.doesNotMatch(html, /srcdoc/i);
  assert.doesNotMatch(html, /<script/i);
});

test("drops script, style, form, object, embed and meta elements", () => {
  for (const payload of fixtures.dangerousElements) {
    const html = render(`before ${payload} after`);
    assert.doesNotMatch(html, /display:none|alert\(1\)|evil\.example/, payload);
    assert.doesNotMatch(
      html,
      /<(script|style|form|object|embed|meta)\b/i,
      payload
    );
  }
});

test("drops event-handler attributes", () => {
  const html = render(fixtures.imgWithHandler);
  assert.doesNotMatch(html, /onerror/i);
  const span = render(fixtures.spanWithHandlers);
  assert.doesNotMatch(span, /onclick|onmouseover/i);
  assert.match(span, /hi/);
});

test("drops javascript: urls from raw anchors and images", () => {
  const a = render(fixtures.javascriptAnchor);
  assert.doesNotMatch(a, /javascript:/i);
  const img = render(fixtures.javascriptImage);
  assert.doesNotMatch(img, /javascript:/i);
});

test("drops inline style attributes", () => {
  const html = render(fixtures.inlineStyleDiv);
  assert.doesNotMatch(html, /style=/i);
});

test("keeps markdown formatting the composer produces", () => {
  const html = render(
    [
      "**bold** and _italic_ and ~~gone~~",
      "",
      "- one",
      "- two",
      "",
      "> quoted",
      "",
      "| a | b |",
      "| - | - |",
      "| 1 | 2 |",
      "",
      `[docs](${fixtures.docsHref})`,
    ].join("\n")
  );
  for (const tag of [
    "strong",
    "em",
    "del",
    "ul",
    "li",
    "blockquote",
    "table",
    "th",
    "td",
  ]) {
    assert.match(html, new RegExp(`<${tag}\\b`), tag);
  }
  assert.ok(html.includes(`href="${fixtures.docsHref}"`));
});

test("keeps code classes the renderer styles", () => {
  const inline = render(fixtures.inlineCode);
  assert.match(inline, /class="slack-inline-code"/);
  const block = render(fixtures.codeBlock);
  assert.match(block, /class="slack-code-block"/);
  assert.match(block, /class="language-ts"/);
});

test("keeps mention spans with their data attributes", () => {
  const html = render(fixtures.mention);
  assert.match(html, /class="mention"/);
  assert.match(html, /data-id="u-1"/);
  assert.match(html, /data-label="dean"/);
});

test("keeps apple emoji images but not arbitrary classes", () => {
  const emoji = render(
    `<img class="apple-emoji-img" alt="😀" src="${fixtures.emojiSrc}" draggable="false" />`
  );
  assert.match(emoji, /class="apple-emoji-img"/);
  assert.ok(emoji.includes(`src="${fixtures.emojiSrc}"`));

  const other = render(fixtures.arbitraryClassSpan);
  assert.doesNotMatch(other, /fixed|inset-0|z-50/);
});
