import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("./useAudioVisualizer.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});

function renderAudioVisualizerHook(props, env = {}) {
  let stateIndex = 0;
  const states = [];
  const setStates = [];

  const fakeUseState = (initial) => {
    const idx = stateIndex++;
    if (states.length <= idx) {
      states.push(initial);
      setStates.push((val) => {
        states[idx] = typeof val === "function" ? val(states[idx]) : val;
      });
    }
    return [states[idx], setStates[idx]];
  };

  const fakeUseRef = (initial) => ({ current: initial });

  let effectCleanup = null;
  const fakeUseEffect = (fn) => {
    effectCleanup = fn();
  };

  const capturedIntervals = [];
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;

  let intervalIdCounter = 1;
  const activeIntervals = new Set();

  globalThis.setInterval = (cb, ms) => {
    const id = intervalIdCounter++;
    activeIntervals.add(id);
    capturedIntervals.push({ id, cb, ms });
    return id;
  };

  globalThis.clearInterval = (id) => {
    activeIntervals.delete(id);
  };

  try {
    const reactMock = {
      useState: fakeUseState,
      useRef: fakeUseRef,
      useEffect: fakeUseEffect,
    };

    const cjsExports = {};
    const requireMock = (id) => {
      if (id === "react") return reactMock;
      throw new Error(`Unexpected require: ${id}`);
    };

    const fn = new Function(
      "exports",
      "require",
      "setInterval",
      "clearInterval",
      "console",
      outputText
    );

    fn(
      cjsExports,
      requireMock,
      globalThis.setInterval,
      globalThis.clearInterval,
      env.console || console
    );

    const result = cjsExports.useAudioVisualizer(props);

    return {
      result,
      getVolume: () => states[1],
      getIsSpeaking: () => states[0],
      intervals: capturedIntervals,
      isIntervalActive: (id) => activeIntervals.has(id),
      cleanup: () => effectCleanup?.(),
    };
  } finally {
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  }
}

test("returns default volume 0 and isSpeaking false when audioTrack is null", () => {
  const hook = renderAudioVisualizerHook({ audioTrack: null });
  assert.equal(hook.getVolume(), 0);
  assert.equal(hook.getIsSpeaking(), false);
  assert.equal(hook.intervals.length, 0);
});

test("updates volume and speaking status on active track polling", () => {
  let volume = 0.5;
  const fakeTrack = {
    getVolumeLevel: () => volume,
  };

  const hook = renderAudioVisualizerHook({
    audioTrack: fakeTrack,
    threshold: 0.1,
  });

  assert.equal(hook.intervals.length, 1);
  const interval = hook.intervals[0];
  assert.equal(interval.ms, 100);

  // Tick interval
  interval.cb();
  assert.equal(hook.getVolume(), 0.5);
  assert.equal(hook.getIsSpeaking(), true);

  // Below threshold
  volume = 0.05;
  interval.cb();
  assert.equal(hook.getVolume(), 0.05);
  assert.equal(hook.getIsSpeaking(), false);

  hook.cleanup();
  assert.equal(hook.isIntervalActive(interval.id), false);
});

test("stops interval and avoids console spam after consecutive track errors", () => {
  let errorCount = 0;
  const warnings = [];
  const fakeConsole = {
    ...console,
    warn: (...args) => warnings.push(args),
    error: (...args) => warnings.push(args),
  };

  const fakeTrack = {
    getVolumeLevel: () => {
      errorCount++;
      throw new Error("Track is disposed or disconnected");
    },
  };

  const hook = renderAudioVisualizerHook(
    { audioTrack: fakeTrack, maxConsecutiveErrors: 3 },
    { console: fakeConsole }
  );

  const interval = hook.intervals[0];
  assert.equal(hook.isIntervalActive(interval.id), true);

  // Tick 1 (error 1) - does not stop yet
  interval.cb();
  assert.equal(errorCount, 1);
  assert.equal(hook.getVolume(), 0);
  assert.equal(hook.getIsSpeaking(), false);
  assert.equal(hook.isIntervalActive(interval.id), true);

  // Tick 2 (error 2) - does not stop yet
  interval.cb();
  assert.equal(errorCount, 2);
  assert.equal(hook.isIntervalActive(interval.id), true);

  // Tick 3 (error 3) - reaches maxConsecutiveErrors, clears interval and logs warning once
  interval.cb();
  assert.equal(errorCount, 3);
  assert.equal(hook.isIntervalActive(interval.id), false);
  assert.equal(warnings.length, 1);
  assert.match(
    warnings[0][0],
    /Audio track volume polling stopped after 3 consecutive errors/
  );
});

test("clears interval immediately if track media stream is marked as ended", () => {
  const fakeTrack = {
    getMediaStreamTrack: () => ({ readyState: "ended" }),
    getVolumeLevel: () => 0.5,
  };

  const hook = renderAudioVisualizerHook({ audioTrack: fakeTrack });
  const interval = hook.intervals[0];
  assert.equal(hook.isIntervalActive(interval.id), true);

  interval.cb();
  assert.equal(hook.isIntervalActive(interval.id), false);
  assert.equal(hook.getVolume(), 0);
  assert.equal(hook.getIsSpeaking(), false);
});

test("handles track-ended event subscription and cleanup", () => {
  let endedHandler = null;
  let offCalled = false;

  const fakeTrack = {
    on: (evt, cb) => {
      if (evt === "track-ended") endedHandler = cb;
    },
    off: (evt) => {
      if (evt === "track-ended") offCalled = true;
    },
    getVolumeLevel: () => 0.5,
  };

  const hook = renderAudioVisualizerHook({ audioTrack: fakeTrack });
  const interval = hook.intervals[0];
  assert.equal(hook.isIntervalActive(interval.id), true);
  assert.notEqual(endedHandler, null);

  // Fire track-ended
  endedHandler();
  assert.equal(hook.isIntervalActive(interval.id), false);
  assert.equal(hook.getVolume(), 0);
  assert.equal(hook.getIsSpeaking(), false);

  hook.cleanup();
  assert.equal(offCalled, true);
});
