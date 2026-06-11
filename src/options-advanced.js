// Go Private Quickly — options page controller
//
// Owns the hardened-mode advanced toggles, persisted through prefs.js with the
// same sync→local fallback used everywhere else, and flashes the "Saved"
// indicator after a successful write.

import { getPrefs, setPref } from "./shared/prefs.js";

const FIELDS = {
  advStrictWebrtc: "adv-strict-webrtc",
  advDisableWebrtc: "adv-disable-webrtc",
  advDisableReferrers: "adv-disable-referrers",
};

const savedEl = document.getElementById("saved-indicator");
let flashTimer;
function flashSaved() {
  if (!savedEl) return;
  savedEl.classList.add("show");
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => savedEl.classList.remove("show"), 1500);
}

function annotateAvailability() {
  // "Disable WebRTC entirely" has no Chromium API, so the control would
  // silently do nothing. Say so plainly instead of offering a dead toggle.
  const note = document.getElementById("adv-disable-webrtc-note");
  if (!note) return;
  note.textContent =
    "Not available on this browser: Chromium has no API to disable WebRTC entirely.";
}

(async () => {
  annotateAvailability();
  const prefs = await getPrefs();
  for (const [key, id] of Object.entries(FIELDS)) {
    const input = document.getElementById(id);
    if (!input) continue;
    input.checked = prefs[key] === true;
    input.addEventListener("change", async () => {
      if (await setPref({ [key]: input.checked })) flashSaved();
    });
  }
})();
