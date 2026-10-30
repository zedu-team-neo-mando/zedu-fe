import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import {
  messageSanitizeSchema,
  rehypeEmojiImagesOnly,
} from "./message-sanitize.ts";

const EMOJI_BASE = "https://cdn.example.com/emoji-datasource";

// Same plugin chain as the channel message and delete-message renderers.
function render(message, emojiBase = EMOJI_BASE) {
  return renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeRaw,
          [rehypeSanitize, messageSanitizeSchema],
          rehypeEmojiImagesOnly(emojiBase),
        ],
      },
      message
    )
  );
}

test("drops the iframe srcdoc payload from the issue", () => {
  const html = render(
    `<p>hi</p><iframe srcdoc="<script>alert(document.domain)</script>"></iframe>`
  );
  assert.doesNotMatch(html, /iframe|srcdoc|script|alert/i);
  assert.match(html, /<p>hi<\/p>/);
});

test("drops elements that can execute or restyle the app", () => {
  const html = render(
    [
      "<script>alert(1)</script>",
      "<style>body{display:none}</style>",
      '<form action="https://evil.example"><input name="password"></form>',
      '<object data="https://evil.example/x.swf"></object>',
      '<embed src="https://evil.example/x.swf">',
      '<meta http-equiv="refresh" content="0;url=https://evil.example">',
      '<svg onload="alert(1)"></svg>',
    ].join("")
  );
  assert.doesNotMatch(
    html,
    /<(script|style|form|object|embed|meta|svg)|evil\.example|alert/i
  );
});

test("drops event handlers, inline styles and javascript: URLs", () => {
  const html = render(
    '<p><span onclick="alert(1)" style="position:fixed;inset:0">x</span>' +
      '<a href="javascript:alert(1)">link</a></p>'
  );
  assert.doesNotMatch(html, /onclick|style=|position:fixed|javascript:/i);
  assert.match(html, /link/);
});

test("keeps the formatting the message composer produces", () => {
  const html = render(
    [
      "<p><strong>bold</strong> <em>italic</em> <s>strike</s> <u>under</u></p>",
      '<p><span data-type="mention" class="mention" data-id="user-1" data-label="Ada" data-mention-suggestion-char="@">@Ada</span></p>',
      '<p><code class="slack-inline-code">npm run dev</code></p>',
      '<pre class="slack-code-block"><code>line 1\nline 2</code></pre>',
      '<ul class="message-editor-bullet-list"><li class="message-editor-list-item"><p>item</p></li></ul>',
      '<ol class="message-editor-ordered-list"><li class="message-editor-list-item"><p>first</p></li></ol>',
      "<blockquote><p>quote</p></blockquote>",
      '<p><a href="https://zedu.chat" target="_blank" rel="noopener noreferrer">zedu</a></p>',
    ].join("")
  );
  for (const expected of [
    "<strong>bold</strong>",
    "<em>italic</em>",
    "<s>strike</s>",
    "<u>under</u>",
    'class="mention"',
    'data-type="mention"',
    'data-id="user-1"',
    'data-label="Ada"',
    'data-mention-suggestion-char="@"',
    '<code class="slack-inline-code">npm run dev</code>',
    '<pre class="slack-code-block">',
    '<ul class="message-editor-bullet-list">',
    '<ol class="message-editor-ordered-list">',
    '<li class="message-editor-list-item">',
    "<blockquote>",
    'href="https://zedu.chat"',
  ]) {
    assert.ok(html.includes(expected), `expected ${expected} in ${html}`);
  }
});

test("keeps markdown tables and fenced code languages", () => {
  const html = render(
    "| a | b |\n| - | - |\n| 1 | 2 |\n\n```js\nconst x = 1;\n```"
  );
  assert.match(html, /<table>/);
  assert.match(html, /<td>1<\/td>/);
  assert.match(html, /<code class="language-js">/);
});

test("keeps Apple emoji images from the emoji datasource only", () => {
  const emoji = `<img class="apple-emoji-img" alt="😀" src="${EMOJI_BASE}/img/apple/64/1f600.png" draggable="false" />`;
  const html = render(
    `<p>hi ${emoji}` +
      '<img src="https://tracker.example/pixel.png">' +
      '<img class="apple-emoji-img" src="https://tracker.example/fake.png">' +
      '<img class="apple-emoji-img" src="https://cdn.example.com/emoji-datasource-evil/x.png">' +
      "</p>"
  );
  assert.match(html, /1f600\.png/);
  assert.match(html, /class="apple-emoji-img"/);
  assert.doesNotMatch(html, /tracker\.example|datasource-evil/);
  assert.equal((html.match(/<img/g) ?? []).length, 1);
});

test("removes every image when no emoji datasource is configured", () => {
  const html = render(
    `<p><img class="apple-emoji-img" alt="😀" src="${EMOJI_BASE}/img/apple/64/1f600.png"></p>`,
    ""
  );
  assert.doesNotMatch(html, /<img/);
});
