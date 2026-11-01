import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("./env-urls.ts", import.meta.url), "utf8");
async function loadHelpers(browser = false) {
  const input = browser
    ? source.replace("process.env[name]", "undefined")
    : source;
  const { outputText } = ts.transpileModule(input, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const server = await loadHelpers();
const browser = await loadHelpers(true);
const names = ["NEXT_PUBLIC_APP_STORE_URL", "NEXT_PUBLIC_PLAY_STORE_URL"];
const original = Object.fromEntries(
  names.map((name) => [name, process.env[name]])
);
afterEach(() => {
  for (const name of names) {
    if (original[name] === undefined) delete process.env[name];
    else process.env[name] = original[name];
  }
});

test("unconfigured store URLs and derived identifiers are empty", () => {
  for (const name of names) delete process.env[name];
  for (const helpers of [server, browser]) {
    assert.equal(helpers.appStoreUrl(), "");
    assert.equal(helpers.playStoreUrl(), "");
    assert.equal(helpers.appStoreAppId(), "");
    assert.equal(helpers.playStorePackageId(), "");
  }
});

test("canonical helpers preserve configured listings and identifier consumers", () => {
  process.env.NEXT_PUBLIC_APP_STORE_URL = "/app/zedu/id1234567890/";
  process.env.NEXT_PUBLIC_PLAY_STORE_URL =
    "/store/apps/details?id=net.example.zedu";
  for (const helpers of [server, browser]) {
    assert.equal(helpers.appStoreUrl(), "/app/zedu/id1234567890");
    assert.equal(
      helpers.playStoreUrl(),
      "/store/apps/details?id=net.example.zedu"
    );
    assert.equal(helpers.appStoreAppId(), "1234567890");
    assert.equal(helpers.playStorePackageId(), "net.example.zedu");
  }
});

test("canonical helpers do not add campaign parameters or change listing queries", () => {
  process.env.NEXT_PUBLIC_APP_STORE_URL = "/app/id123?country=ng";
  process.env.NEXT_PUBLIC_PLAY_STORE_URL =
    "/store/apps/details?id=net.example.zedu&hl=en";
  assert.equal(server.appStoreUrl(), process.env.NEXT_PUBLIC_APP_STORE_URL);
  assert.equal(server.playStoreUrl(), process.env.NEXT_PUBLIC_PLAY_STORE_URL);
});
