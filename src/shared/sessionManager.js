// Go Private Quickly — hardened-session orchestration
//
// Opens private windows and, for the hardened path, drives the browser
// adapter over the declarative setting list. Runs entirely in the popup
// context (an extension page with full chrome.* access), so no background
// message round-trip is needed.
//
// Hardened windows are created UNFOCUSED on purpose: a focused new window
// would steal focus from the popup's parent window and dismiss the popup
// before it can finish applying the settings (which all run in the popup
// context). Once hardening is applied the popup brings the window to the front
// and closes itself; the window is only left unfocused when hardening couldn't
// be applied, so the popup can explain why.
//
// No restoration bookkeeping is stored: Chromium uses incognito_session_only
// (browser auto-restores; see chromiumAdapter). Nothing is ever written that
// could outlive the session, so there is nothing to restore after a restart.

import { chromiumAdapter } from "./chromiumAdapter.js";

export async function openPlainPrivateWindow() {
  return chrome.windows.create({ incognito: true });
}

export async function openHardenedSession(hardenedSet) {
  let windowId;
  try {
    const win = await chrome.windows.create({ incognito: true, focused: false });
    windowId = win.id;
  } catch {
    return { ok: false, reason: "window-failed", windowId: null, allowed: false };
  }

  let allowed = false;
  try {
    allowed = await chrome.extension.isAllowedIncognitoAccess();
  } catch {
    allowed = false;
  }
  if (!allowed) {
    // The window opened, but the extension can't run in / control private
    // mode until the user enables it. Skip applying so we never half-apply.
    return { ok: true, windowId, allowed: false };
  }

  // Apply each protection in order. applyOne reports its own failures and
  // never throws meaningfully; the guard is belt-and-suspenders so one bad
  // setting can't abort the rest of the list.
  for (const entry of hardenedSet) {
    try {
      await chromiumAdapter.applyOne(entry);
    } catch {
      // Ignore — continue with the next setting.
    }
  }

  return { ok: true, windowId, allowed: true };
}

export async function focusWindow(windowId) {
  try {
    await chrome.windows.update(windowId, { focused: true });
  } catch {
    // Window may already be closed; nothing to focus.
  }
}
