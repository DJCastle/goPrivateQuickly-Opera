// Go Private Quickly — declarative hardened-setting list
//
// The single source of truth for which privacy settings Hardened Private Mode
// attempts to apply. Each entry is declarative; the chromiumAdapter decides
// whether the API exists, whether it is controllable, and how to apply it.
//
//   id         stable identifier (used by the UI for labels/ordering)
//   label      human-readable protection name (used to label each result)
//   path       property path under chrome.privacy.* (probed for existence)
//   applyValue value to set when applying the protection
//   met(v)     true when the current value already satisfies the protection
//              (reported as "Already protected by browser")
//   advanced   true for opt-in advanced protections (off by default)
//
// Settings the spec forbids touching (Safe Browsing, password manager,
// certificate/HTTPS/update/download protections, autofill) are deliberately
// absent — they are never read or written.

const FALSE_DISABLES = (v) => v === false; // "feature off" is satisfied by false

export function buildHardenedSet(prefs) {
  const webrtcTarget = prefs.advStrictWebrtc
    ? "proxy_only"
    : "disable_non_proxied_udp";

  const entries = [
    {
      id: "webrtcIpPolicy",
      label: "WebRTC IP protection",
      path: ["network", "webRTCIPHandlingPolicy"],
      applyValue: webrtcTarget,
      met: (v) =>
        webrtcTarget === "proxy_only"
          ? v === "proxy_only"
          : v === "disable_non_proxied_udp" || v === "proxy_only",
    },
    boolOff("networkPrediction", "Network prediction", ["network", "networkPredictionEnabled"]),
    boolOff("searchSuggestions", "Address-bar search suggestions", ["services", "searchSuggestEnabled"]),
    boolOff("hyperlinkAuditing", "Hyperlink auditing (<a ping>)", ["websites", "hyperlinkAuditingEnabled"]),
    boolOff("alternateErrorPages", "Alternate error pages", ["services", "alternateErrorPagesEnabled"]),
    boolOff("spellingService", "Online spelling service", ["services", "spellingServiceEnabled"]),
    boolOff("topics", "Topics advertising API", ["websites", "topicsEnabled"]),
    boolOff("adMeasurement", "Ad measurement API", ["websites", "adMeasurementEnabled"]),
    boolOff("relatedWebsiteSets", "Related Website Sets", ["websites", "relatedWebsiteSetsEnabled"]),
    boolOff("fledge", "Protected Audience (FLEDGE) API", ["websites", "fledgeEnabled"]),
    {
      id: "thirdPartyCookies",
      label: "Third-party cookies blocked",
      path: ["websites", "thirdPartyCookiesAllowed"],
      applyValue: false,
      met: FALSE_DISABLES, // already blocked (e.g. Chrome incognito default)
    },
  ];

  if (prefs.advDisableWebrtc) {
    // Firefox: privacy.network.peerConnectionEnabled. Chromium has no
    // supported API to disable WebRTC entirely, so the path probe naturally
    // reports it as unavailable there.
    entries.push({
      ...boolOff("disableWebrtc", "WebRTC disabled entirely", ["network", "peerConnectionEnabled"]),
      advanced: true,
    });
  }
  if (prefs.advDisableReferrers) {
    entries.push({
      ...boolOff("referrers", "Referrer headers disabled", ["websites", "referrersEnabled"]),
      advanced: true,
    });
  }

  return entries;
}

function boolOff(id, label, path) {
  return { id, label, path, applyValue: false, met: FALSE_DISABLES };
}
