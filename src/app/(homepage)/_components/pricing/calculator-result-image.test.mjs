import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Keep these tests runnable on the repository's Node 20 CI runtime.
const { outputText } = ts.transpileModule(
  readFileSync(
    new URL("./calculator-result-image.ts", import.meta.url),
    "utf8"
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }
);
const {
  createCalculatorResultImage,
  downloadCalculatorResultImage,
  shareCalculatorResultImage,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

function replaceGlobal(t, name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, value });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  });
}

function downloads(t) {
  const clicked = [],
    revoked = [],
    timers = [];
  let removed = 0;
  t.mock.method(URL, "createObjectURL", () => "blob:calculator-result");
  t.mock.method(URL, "revokeObjectURL", (url) => revoked.push(url));
  replaceGlobal(t, "window", {
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
  });
  replaceGlobal(t, "document", {
    body: { append() {} },
    createElement: () => ({
      href: "",
      download: "",
      click() {
        clicked.push({ href: this.href, name: this.download });
      },
      remove() {
        removed++;
      },
    }),
  });
  return {
    clicked,
    revoked,
    timers,
    get removed() {
      return removed;
    },
  };
}

const file = () =>
  new File(["image"], "cohort-estimate.png", { type: "image/png" });

function canvas(t, { context = true, blob = true } = {}) {
  const drawn = [];
  const ctx = {
    beginPath() {},
    roundRect() {},
    fill() {},
    fillRect() {},
    createLinearGradient: () => ({ addColorStop() {} }),
    measureText: (text) => ({ width: text.length * 15 }),
    fillText: (text) => drawn.push(text),
  };
  const element = {
    getContext: () => (context ? ctx : null),
    toBlob: (callback, type) => {
      assert.equal(type, "image/png");
      callback(blob ? new Blob(["png"], { type }) : null);
    },
  };
  replaceGlobal(t, "document", { createElement: () => element });
  return { element, drawn };
}

const result = {
  learnerCount: 350,
  durationMonths: 3,
  slackMonthlyEstimate: 4_725_000,
  slackDurationTotal: 14_175_000,
  zeduMonthlyPrice: 20_000,
  zeduDurationTotal: 60_000,
  monthlySavings: 4_705_000,
  durationSavings: 14_115_000,
  savingsPercentage: (14_115_000 / 14_175_000) * 100,
};

test("exports the selected cohort, costs, savings and estimate disclaimer as a square PNG", async (t) => {
  const { element, drawn } = canvas(t);
  const png = await createCalculatorResultImage(result);
  assert.equal(png.type, "image/png");
  assert.equal(png.name, "zedu-vs-slack-350-learners-3-months.png");
  assert.equal(element.width, 1080);
  assert.equal(element.height, 1080);
  for (const text of [
    "350 learners · 3 months",
    "₦14,175,000",
    "₦60,000",
    "₦14,115,000",
    "99.6%",
    "Illustrative estimate only. Actual Slack pricing may vary.",
  ]) {
    assert.ok(drawn.includes(text), `Image should include ${text}`);
  }
});

test("a subsequent export uses the new inputs, including maximum learner count and one month", async (t) => {
  const { drawn } = canvas(t);
  const png = await createCalculatorResultImage({
    ...result,
    learnerCount: 5000,
    durationMonths: 1,
    slackMonthlyEstimate: 67_500_000,
    slackDurationTotal: 67_500_000,
    zeduDurationTotal: 20_000,
    monthlySavings: 67_480_000,
    durationSavings: 67_480_000,
    savingsPercentage: 99.97037037,
  });
  assert.equal(png.name, "zedu-vs-slack-5000-learners-1-months.png");
  assert.ok(drawn.includes("5,000 learners · 1 month"));
  assert.ok(drawn.includes("₦67,480,000"));
});

test("image generation reports canvas and encoding failures", async (t) => {
  await t.test("missing canvas context", async (t) => {
    canvas(t, { context: false });
    await assert.rejects(createCalculatorResultImage(result), /unavailable/);
  });
  await t.test("failed PNG encoding", async (t) => {
    canvas(t, { blob: false });
    await assert.rejects(
      createCalculatorResultImage(result),
      /Could not create/
    );
  });
});

test("saving downloads a named file and releases its URL after the browser can consume it", (t) => {
  const saved = downloads(t);
  downloadCalculatorResultImage(file());
  assert.deepEqual(saved.clicked, [
    { href: "blob:calculator-result", name: "cohort-estimate.png" },
  ]);
  assert.equal(saved.removed, 1);
  assert.equal(saved.revoked.length, 0);
  assert.equal(saved.timers[0].delay, 10_000);
  saved.timers[0].callback();
  assert.deepEqual(saved.revoked, ["blob:calculator-result"]);
});

test("native sharing receives the prepared PNG before any asynchronous work", async (t) => {
  const saved = downloads(t);
  const png = file();
  let shared;
  replaceGlobal(t, "navigator", {
    canShare: ({ files }) => files[0] === png,
    share: (data) => {
      shared = data;
      return Promise.resolve();
    },
  });
  const outcome = shareCalculatorResultImage(png);
  assert.equal(shared.files[0], png, "share must run during the click gesture");
  assert.equal(await outcome, "shared");
  assert.equal(saved.clicked.length, 0);
});

test("unsupported file sharing falls back to downloading the PNG", async (t) => {
  const saved = downloads(t);
  replaceGlobal(t, "navigator", {
    canShare: () => false,
    share: () => assert.fail("Unsupported share called"),
  });
  assert.equal(await shareCalculatorResultImage(file()), "downloaded");
  assert.equal(saved.clicked.length, 1);
});

test("browsers without a share API can still save the result", async (t) => {
  const saved = downloads(t);
  replaceGlobal(t, "navigator", {});
  assert.equal(await shareCalculatorResultImage(file()), "downloaded");
  assert.equal(saved.clicked.length, 1);
});

test("cancelling the share sheet does not start an unwanted download", async (t) => {
  const saved = downloads(t);
  replaceGlobal(t, "navigator", {
    canShare: () => true,
    share: async () => {
      throw new DOMException("Cancelled", "AbortError");
    },
  });
  assert.equal(await shareCalculatorResultImage(file()), "cancelled");
  assert.equal(saved.clicked.length, 0);
});

test("a blocked native share falls back to a downloadable image", async (t) => {
  const saved = downloads(t);
  replaceGlobal(t, "navigator", {
    canShare: () => true,
    share: async () => {
      throw new DOMException("Blocked", "NotAllowedError");
    },
  });
  assert.equal(await shareCalculatorResultImage(file()), "downloaded");
  assert.equal(saved.clicked.length, 1);
});
