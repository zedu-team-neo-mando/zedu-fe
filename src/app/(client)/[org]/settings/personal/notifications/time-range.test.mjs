import test from "node:test";
import assert from "node:assert/strict";
import { buildTimeRange, convertTo12Hour, isValidHHmm } from "./time-range.ts";

test("serializes the valid window from the issue report", () => {
  assert.equal(buildTimeRange("09:15", "18:45"), "09:15 AM - 06:45 PM");
});

test("serializes an ordinary daytime window", () => {
  assert.equal(buildTimeRange("08:30", "17:00"), "08:30 AM - 05:00 PM");
});

test("preserves overnight semantics", () => {
  assert.equal(buildTimeRange("22:00", "06:00"), "10:00 PM - 06:00 AM");
});

test("preserves equal-time (all-day) semantics", () => {
  assert.equal(buildTimeRange("00:00", "00:00"), "12:00 AM - 12:00 AM");
});

test("handles hour boundaries in 12-hour formatting", () => {
  assert.equal(convertTo12Hour("00:00"), "12:00 AM");
  assert.equal(convertTo12Hour("12:00"), "12:00 PM");
  assert.equal(convertTo12Hour("23:59"), "11:59 PM");
});

test("rejects a cleared From time and posts nothing", () => {
  assert.equal(buildTimeRange("", "17:00"), null);
});

test("rejects a cleared To time and posts nothing", () => {
  assert.equal(buildTimeRange("08:30", ""), null);
});

test("rejects both endpoints cleared", () => {
  assert.equal(buildTimeRange("", ""), null);
});

test("rejects the previously malformed NaN:undefined output", () => {
  assert.equal(buildTimeRange("NaN:undefined", "17:00"), null);
  assert.equal(isValidHHmm("NaN:undefined"), false);
});

test("rejects out-of-range or malformed values", () => {
  assert.equal(isValidHHmm("24:00"), false);
  assert.equal(isValidHHmm("8:3"), false);
  assert.equal(isValidHHmm("12:60"), false);
  assert.equal(isValidHHmm("08:30 AM"), false);
});
