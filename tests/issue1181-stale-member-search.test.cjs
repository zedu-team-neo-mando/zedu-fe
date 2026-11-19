const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const filePath = path.join(
  __dirname,
  "..",
  "src",
  "hooks",
  "useOrganisationUsers.ts"
);

const source = fs.readFileSync(filePath, "utf8");

const fetchStart = source.indexOf("const fetchSearchUsers = useCallback(");
const fetchEnd = source.indexOf("// Browse mode:", fetchStart);
assert.ok(fetchStart >= 0 && fetchEnd > fetchStart, "fetchSearchUsers missing");
const fetchSearchUsers = source.slice(fetchStart, fetchEnd);

const effectStart = source.indexOf("// Search mode: refetch when debounced");
const effectEnd = source.indexOf("const loadMore = useCallback(", effectStart);
assert.ok(effectStart >= 0 && effectEnd > effectStart, "search effect missing");
const searchEffect = source.slice(effectStart, effectEnd);

test("every search request carries the generation it was started for", () => {
  assert.match(source, /const searchGenerationRef = useRef\(0\)/);
  assert.match(fetchSearchUsers, /generation: number/);
  assert.match(
    searchEffect,
    /fetchSearchUsers\(1, true, debouncedSearch\.trim\(\), generation\)/
  );
  assert.match(
    source,
    /fetchSearchUsers\(\s*nextPage,\s*false,\s*debouncedSearch\.trim\(\),\s*searchGenerationRef\.current\s*\)/
  );
});

test("a query, org or enabled change invalidates in-flight searches", () => {
  assert.match(searchEffect, /searchGenerationRef\.current \+= 1/);
  assert.match(searchEffect, /searchInflightRef\.current\.clear\(\)/);
  // The bump happens before any early return, so a cleared or disabled
  // search also drops whatever is still in flight.
  const bumpAt = searchEffect.indexOf("searchGenerationRef.current += 1");
  const returnAt = searchEffect.indexOf("return;");
  assert.ok(
    bumpAt >= 0 && returnAt > bumpAt,
    "generation bump must come first"
  );
});

test("responses and finalizers for an obsolete generation are ignored", () => {
  const awaitAt = fetchSearchUsers.indexOf("await GetRequest(");
  const guardAt = fetchSearchUsers.indexOf(
    "if (generation !== searchGenerationRef.current) return;",
    awaitAt
  );
  const applyAt = fetchSearchUsers.indexOf("setSearchUsers(", awaitAt);
  assert.ok(awaitAt >= 0, "search request missing");
  assert.ok(
    guardAt > awaitAt && guardAt < applyAt,
    "stale responses must be dropped before results are applied"
  );
  assert.match(
    fetchSearchUsers,
    /finally \{[\s\S]*if \(generation === searchGenerationRef\.current\) \{[\s\S]*searchInflightRef\.current\.delete\(pageNumber\);[\s\S]*setSearchLoading\(searchInflightRef\.current\.size > 0\);/
  );
});
