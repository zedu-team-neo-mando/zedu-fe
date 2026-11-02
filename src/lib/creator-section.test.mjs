import test from "node:test";
import assert from "node:assert/strict";
import {
  creatorFeatures,
  creatorJourney,
  creatorSectionCopy,
} from "../app/(homepage)/_lib/creatorSectionData.ts";

test("has the three creator feature cards", () => {
  assert.deepEqual(
    creatorFeatures.map((feature) => feature.title),
    [
      "Creator Cohorts and Courses",
      "Live Feedback and Reviews",
      "Creator Community and Collaboration",
    ]
  );
  for (const feature of creatorFeatures) assert.ok(feature.desc.length > 0);
});

test("journey runs from channel basics to monetisation", () => {
  assert.deepEqual(
    creatorJourney.map((step) => step.title),
    [
      "Channel Basics",
      "Content and Editing",
      "Growth and Analytics",
      "Monetisation and Collaboration",
    ]
  );
});

test("copy uses the ticket's search phrases", () => {
  const text = JSON.stringify(creatorSectionCopy).toLowerCase();
  for (const phrase of [
    "youtube creator training",
    "creator academy",
    "youtube growth course",
    "creator community platform",
  ]) {
    assert.ok(text.includes(phrase), `missing "${phrase}"`);
  }
});

test("copy names YouTube without implying a partnership", () => {
  const text = JSON.stringify({
    creatorSectionCopy,
    creatorFeatures,
    creatorJourney,
  });
  assert.match(creatorSectionCopy.description, /YouTube educators/);
  assert.doesNotMatch(text, /partner|official|endorsed|logo/i);
});
