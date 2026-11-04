import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("./campaign-attribution.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const {
  captureCampaign,
  readCampaign,
  setCampaignConsent,
  campaignPayload,
  reportCampaignVisit,
  CAMPAIGN_KEY,
  CONSENT_KEY,
  ATTRIBUTION_WINDOW,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const values = new Map();
const store = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};
const now = Date.now();
const visit = () => "c83e7b18-3be2-4ea1-a2b3-0b1c2d3e4f56";
const query =
  "?utm_source=newsletter&utm_medium=email&utm_campaign=cohort-launch&email=private%40example.com&token=secret";
beforeEach(() => {
  values.clear();
  globalThis.window = { localStorage: store };
});

test("public storage names remain compatible with existing saved attribution", () => {
  assert.equal(CAMPAIGN_KEY, "zedu:campaign-attribution:v1");
  assert.equal(CONSENT_KEY, "zedu:campaign-consent:v1");
});

test("does not capture until explicit consent", () => {
  assert.equal(captureCampaign(query, store, now, visit), undefined);
  assert.equal(values.has(CAMPAIGN_KEY), false);
  setCampaignConsent("denied", store);
  assert.equal(captureCampaign(query, store, now, visit), undefined);
});
test("captures only allowlisted campaign fields and keeps the first touch across navigation/reload", () => {
  setCampaignConsent("granted", store);
  const a = captureCampaign(query, store, now, visit);
  assert.equal(a.utm_source, "newsletter");
  assert.equal(a.email, undefined);
  assert.equal(a.token, undefined);
  assert.deepEqual(
    captureCampaign("?utm_source=other", store, now + 10, visit),
    a
  );
  assert.deepEqual(readCampaign(store, now + 1000), a);
  assert.deepEqual(campaignPayload(), { campaign: a });
});
test("expires attribution and permits a new eligible touch", () => {
  setCampaignConsent("granted", store);
  captureCampaign(query, store, now, visit);
  assert.equal(readCampaign(store, now + ATTRIBUTION_WINDOW + 1), undefined);
  assert.equal(
    captureCampaign(
      "?utm_source=search",
      store,
      now + ATTRIBUTION_WINDOW + 2,
      visit
    ).utm_source,
    "search"
  );
});
test("withdrawal clears metadata and removes it from subsequent business requests", () => {
  setCampaignConsent("granted", store);
  captureCampaign(query, store, now, visit);
  setCampaignConsent("denied", store);
  assert.equal(values.has(CAMPAIGN_KEY), false);
  assert.deepEqual(campaignPayload(), {});
});
test("missing, oversized, personal-data and corrupt values are ignored", () => {
  setCampaignConsent("granted", store);
  for (const q of [
    "",
    "?utm_source=person%40example.com",
    `?utm_source=${"a".repeat(101)}`,
    "?utm_source=email&utm_campaign=%3Cscript%3E",
  ]) {
    assert.equal(captureCampaign(q, store, now, visit), undefined);
  }
  values.set(CAMPAIGN_KEY, "broken");
  assert.equal(readCampaign(store, now), undefined);
});
test("blocked storage never throws or prevents the caller from continuing", () => {
  const blocked = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("denied");
    },
    removeItem() {
      throw new Error("denied");
    },
  };
  assert.doesNotThrow(() => setCampaignConsent("granted", blocked));
  assert.equal(captureCampaign(query, blocked, now, visit), undefined);
  assert.equal(readCampaign(blocked, now), undefined);
});
test("cross-tab withdrawal is honored by the next payload", () => {
  setCampaignConsent("granted", store);
  captureCampaign(query, store, now, visit);
  values.set(CONSENT_KEY, "denied");
  assert.deepEqual(campaignPayload(), {});
});
test("failed analytics can retry and successful visits are sent once per runtime", async () => {
  setCampaignConsent("granted", store);
  const a = captureCampaign(query, store, now, visit);
  process.env.NEXT_PUBLIC_BASE_URL = "/api/v1/";
  let calls = 0;
  globalThis.fetch = async (url) => {
    assert.equal(url, "/api/v1/campaign/visits");
    calls++;
    if (calls === 1) throw new Error("offline");
    return { ok: true };
  };
  await reportCampaignVisit(a);
  await reportCampaignVisit(a);
  await reportCampaignVisit(a);
  assert.equal(calls, 2);
});

test("empty optional UTM labels do not discard a valid campaign", () => {
  setCampaignConsent("granted", store);
  const a = captureCampaign(
    "?utm_source=%20email%20&utm_medium=&utm_term=%20",
    store,
    now,
    visit
  );
  assert.equal(a.utm_source, "email");
  assert.equal(a.utm_medium, undefined);
  assert.equal(a.utm_term, undefined);
});

test("stored payloads retain only contract fields and reject corrupt visit ids", () => {
  setCampaignConsent("granted", store);
  const a = captureCampaign(query, store, now, visit);
  values.set(
    CAMPAIGN_KEY,
    JSON.stringify({ ...a, email: "private", token: "private" })
  );
  assert.deepEqual(campaignPayload(), { campaign: a });
  values.set(
    CAMPAIGN_KEY,
    JSON.stringify({ ...a, visit_id: a.visit_id + "\n" })
  );
  assert.deepEqual(campaignPayload(), {});
});

test("withdrawal still prevents payloads and visit events when writes fail", async () => {
  setCampaignConsent("granted", store);
  const a = captureCampaign(query, store, now, () => crypto.randomUUID());
  const readOnly = {
    ...store,
    setItem() {
      throw new Error("read-only");
    },
    removeItem() {
      throw new Error("read-only");
    },
  };
  globalThis.window.localStorage = readOnly;
  setCampaignConsent("denied", readOnly);
  assert.deepEqual(campaignPayload(), {});
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return { ok: true };
  };
  await reportCampaignVisit(a);
  assert.equal(calls, 0);
});
