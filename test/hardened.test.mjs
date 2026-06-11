// Automated tests for the hardened-mode pure logic.
//
//   node --test
//
// Zero dependencies — Node's built-in test runner. Covers the declarative
// setting builder and the Chromium adapter decision logic with a mocked
// chrome.privacy. Browser-integration behavior (window lifecycle, real
// ChromeSetting scopes) is covered by the manual testing checklist.

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildHardenedSet } from "../src/shared/hardenedDefaults.js";
import { chromiumAdapter } from "../src/shared/chromiumAdapter.js";

const NO_ADV = {
  advStrictWebrtc: false,
  advDisableWebrtc: false,
  advDisableReferrers: false,
};

function findEntry(set, id) {
  return set.find((e) => e.id === id);
}

// ---- buildHardenedSet ---------------------------------------------------

test("default set uses disable_non_proxied_udp for WebRTC", () => {
  const set = buildHardenedSet(NO_ADV);
  assert.equal(findEntry(set, "webrtcIpPolicy").applyValue, "disable_non_proxied_udp");
});

test("default set has no advanced entries", () => {
  const set = buildHardenedSet(NO_ADV);
  assert.equal(set.some((e) => e.advanced), false);
  assert.equal(findEntry(set, "disableWebrtc"), undefined);
  assert.equal(findEntry(set, "referrers"), undefined);
});

test("default set blocks third-party cookies and includes Privacy Sandbox toggles", () => {
  const set = buildHardenedSet(NO_ADV);
  assert.equal(findEntry(set, "thirdPartyCookies").applyValue, false);
  for (const id of ["topics", "adMeasurement", "relatedWebsiteSets", "fledge"]) {
    assert.ok(findEntry(set, id), `expected ${id} in default set`);
  }
});

test("strict WebRTC option switches to proxy_only", () => {
  const set = buildHardenedSet({ ...NO_ADV, advStrictWebrtc: true });
  const webrtc = findEntry(set, "webrtcIpPolicy");
  assert.equal(webrtc.applyValue, "proxy_only");
  assert.equal(webrtc.met("disable_non_proxied_udp"), false, "non-strict no longer satisfies strict");
  assert.equal(webrtc.met("proxy_only"), true);
});

test("advanced options add their entries, flagged advanced", () => {
  const set = buildHardenedSet({ advStrictWebrtc: false, advDisableWebrtc: true, advDisableReferrers: true });
  assert.equal(findEntry(set, "disableWebrtc").advanced, true);
  assert.equal(findEntry(set, "referrers").advanced, true);
});

// ---- chromiumAdapter ----------------------------------------------------

function mockSetting({ value, levelOfControl, throwOnSet = false }) {
  const calls = { set: [] };
  globalThis.chrome = {
    privacy: {
      network: {
        webRTCIPHandlingPolicy: {
          async get() {
            return { value, levelOfControl };
          },
          async set(arg) {
            if (throwOnSet) throw new Error("denied");
            calls.set.push(arg);
          },
        },
      },
    },
  };
  return calls;
}

const WEBRTC_ENTRY = {
  path: ["network", "webRTCIPHandlingPolicy"],
  applyValue: "disable_non_proxied_udp",
  met: (v) => v === "disable_non_proxied_udp" || v === "proxy_only",
};

test("chromium: applies a controllable setting with incognito_session_only scope", async () => {
  const calls = mockSetting({ value: "default", levelOfControl: "controllable_by_this_extension" });
  const r = await chromiumAdapter.applyOne(WEBRTC_ENTRY);
  assert.equal(r.status, "applied");
  assert.equal(calls.set[0].scope, "incognito_session_only");
  assert.equal(calls.set[0].value, "disable_non_proxied_udp");
});

test("chromium: reports already-protected when the value already satisfies", async () => {
  mockSetting({ value: "disable_non_proxied_udp", levelOfControl: "controllable_by_this_extension" });
  const r = await chromiumAdapter.applyOne(WEBRTC_ENTRY);
  assert.equal(r.status, "already-protected");
});

test("chromium: reports blocked under policy", async () => {
  mockSetting({ value: "default", levelOfControl: "not_controllable" });
  const r = await chromiumAdapter.applyOne(WEBRTC_ENTRY);
  assert.equal(r.status, "blocked");
});

test("chromium: reports blocked when another extension controls it", async () => {
  mockSetting({ value: "default", levelOfControl: "controlled_by_other_extensions" });
  const r = await chromiumAdapter.applyOne(WEBRTC_ENTRY);
  assert.equal(r.status, "blocked");
});

test("chromium: reports unavailable when the API path is missing", async () => {
  globalThis.chrome = { privacy: {} };
  const r = await chromiumAdapter.applyOne(WEBRTC_ENTRY);
  assert.equal(r.status, "unavailable");
});

test("chromium: reports failed when set throws", async () => {
  mockSetting({ value: "default", levelOfControl: "controllable_by_this_extension", throwOnSet: true });
  const r = await chromiumAdapter.applyOne(WEBRTC_ENTRY);
  assert.equal(r.status, "failed");
});
