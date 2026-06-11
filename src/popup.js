// Go Private Quickly — popup controller
//
// Two clearly separate actions:
//   * Standard Private Window — a plain incognito/private window, no settings
//     touched. Opens and dismisses the popup.
//   * Open Hardened Private Window — opens a private window, applies supported
//     session-scoped privacy protections, brings it to the front, and
//     dismisses the popup. The "what hardened does" link in the chooser
//     explains what gets tightened; we don't make the user read a report.
//
// If hardening can't be applied because Go Private Quickly isn't enabled in
// private mode yet, the popup opens the one-step onboarding page so the user
// can fix it, rather than silently opening an unhardened window.
//
// All work happens in this popup context. The hardened window is opened
// unfocused so this popup stays alive long enough to apply the settings,
// then we focus the window and close the popup.

import {
  openPlainPrivateWindow,
  openHardenedSession,
  focusWindow,
} from "./shared/sessionManager.js";
import { buildHardenedSet } from "./shared/hardenedDefaults.js";
import { getPrefs } from "./shared/prefs.js";

const el = (id) => document.getElementById(id);

// ---- Standard private window -------------------------------------------

el("open-private").addEventListener("click", async () => {
  await openPlainPrivateWindow();
  window.close();
});

// ---- Settings -----------------------------------------------------------

el("open-settings").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  else chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
});

// ---- Hardened private window -------------------------------------------

el("open-hardened").addEventListener("click", async () => {
  const result = await openHardenedSession(buildHardenedSet(await getPrefs()));

  if (result.ok && result.allowed) {
    // Hardened applied — bring the private window to the front.
    await focusWindow(result.windowId);
  } else if (result.ok) {
    // Window opened but GPQ isn't enabled in private mode, so nothing was
    // hardened. Send the user to onboarding to enable it.
    await chrome.tabs.create({ url: chrome.runtime.getURL("onboarding.html") });
  }
  window.close();
});
