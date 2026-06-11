// Go Private Quickly — hardened-mode preferences
//
// Centralizes the preference keys that Hardened Private Mode adds, with the
// same chrome.storage.sync → chrome.storage.local fallback pattern used
// elsewhere in the extension.
//
// All values are booleans, all default to false. Advanced options must be
// opt-in.

export const HARDENED_DEFAULTS = {
  advStrictWebrtc: false, // WebRTC IP policy proxy_only instead of the default
  advDisableWebrtc: false, // disable WebRTC peer connections entirely (where supported)
  advDisableReferrers: false, // disable referrer headers (where supported)
};

function coerceBooleans(res) {
  const out = {};
  for (const key of Object.keys(HARDENED_DEFAULTS)) {
    out[key] = res[key] === true;
  }
  return out;
}

export async function getPrefs() {
  try {
    return coerceBooleans(await chrome.storage.sync.get(HARDENED_DEFAULTS));
  } catch {
    try {
      return coerceBooleans(await chrome.storage.local.get(HARDENED_DEFAULTS));
    } catch {
      return { ...HARDENED_DEFAULTS };
    }
  }
}

export async function setPref(patch) {
  try {
    await chrome.storage.sync.set(patch);
    return true;
  } catch {
    try {
      await chrome.storage.local.set(patch);
      return true;
    } catch {
      return false;
    }
  }
}
