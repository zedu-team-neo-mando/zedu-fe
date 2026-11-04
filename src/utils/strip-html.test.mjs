import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("./strip-html.ts", import.meta.url),
  "utf8"
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const { stripHtmlTags } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

/**
 * A stand-in browser. Any element made in the live page records the HTML it
 * is given, because doing that is what lets `<img onerror>` run. DOMParser
 * returns the text the way a real inert document would.
 */
const withBrowser = (run) => {
  const livePageHtml = [];
  globalThis.window = {};
  globalThis.document = {
    createElement: () => ({
      set innerHTML(value) {
        livePageHtml.push(value);
      },
      textContent: "",
    }),
  };
  globalThis.DOMParser = class {
    parseFromString(html) {
      return { body: { textContent: html.replace(/<[^>]*>/g, "") } };
    }
  };
  try {
    run(livePageHtml);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.DOMParser;
  }
};

test("returns the plain text of a message", () => {
  withBrowser(() => {
    assert.equal(
      stripHtmlTags(
        '<p>Yes, use this: <a href="https://example.com">the form</a></p>'
      ),
      "Yes, use this: the form"
    );
  });
});

test("never parses message HTML into the live page", () => {
  withBrowser((livePageHtml) => {
    stripHtmlTags('hey <img src="x" onerror="alert(document.cookie)">');
    stripHtmlTags('<svg><svg onload="alert(1)"></svg></svg>');
    assert.deepEqual(livePageHtml, []);
  });
});

test("handles empty and missing input", () => {
  withBrowser(() => {
    assert.equal(stripHtmlTags(""), "");
    assert.equal(stripHtmlTags(undefined), "");
  });
});

test("returns the input unchanged during server rendering", () => {
  assert.equal(typeof globalThis.window, "undefined");
  assert.equal(stripHtmlTags("<b>hi</b>"), "<b>hi</b>");
});
