// Go Private Quickly — Chromium privacy adapter
//
// Applies one hardened setting at a time using the chrome.privacy ChromeSetting
// API with scope "incognito_session_only". That scope is the backbone of this
// extension's reliability contract:
//
//   * The value applies ONLY to the active incognito session — normal
//     browsing windows keep their settings untouched.
//   * The browser clears it automatically when the LAST incognito window
//     closes, so "restore on close" needs no bookkeeping.
//   * Incognito-session values live only in memory, so an unexpected browser
//     exit cannot leave a hardened value behind — a fresh launch starts a
//     fresh session at defaults. Crash recovery is therefore structural.
//
// The 7-step guard the spec requires is implemented per setting:
//   1. API exists?            -> path probe
//   2. read current value     -> node.get({ incognito: true })
//   3. allowed to control?    -> levelOfControl
//   4. apply only if allowed
//   5. (no original saved — incognito_session_only needs no restoration)
//   6. errors caught per setting
//   7. caller continues with the next setting regardless of this result

function resolveNode(path) {
  if (!chrome.privacy) return undefined;
  return path.reduce((obj, key) => (obj == null ? obj : obj[key]), chrome.privacy);
}

export const chromiumAdapter = {
  async applyOne(entry) {
    const node = resolveNode(entry.path);
    if (!node || typeof node.get !== "function" || typeof node.set !== "function") {
      return { status: "unavailable" };
    }

    let details;
    try {
      details = await node.get({ incognito: true });
    } catch {
      return { status: "unavailable" };
    }

    const control = details.levelOfControl;
    if (control === "not_controllable" || control === "controlled_by_other_extensions") {
      return { status: "blocked" };
    }

    try {
      if (entry.met(details.value)) return { status: "already-protected" };
    } catch {
      // An unexpected value shape — fall through and try to apply.
    }

    if (control !== "controllable_by_this_extension" && control !== "controlled_by_this_extension") {
      return { status: "blocked" };
    }

    try {
      await node.set({ value: entry.applyValue, scope: "incognito_session_only" });
      return { status: "applied" };
    } catch {
      return { status: "failed" };
    }
  },
};
