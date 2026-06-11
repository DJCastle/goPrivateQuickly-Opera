# Store Submission Checklist — Go Private Quickly (Opera)

Opera add-ons store submission (addons.opera.com). The Chromium build (Chrome,
Brave, Edge, Arc, Vivaldi) ships from
[goPrivateQuickly-Chromium](https://github.com/DJCastle/goPrivateQuickly-Chromium);
Firefox (AMO) from
[goPrivateQuickly-Firefox](https://github.com/DJCastle/goPrivateQuickly-Firefox).
Run the [testing checklist](testing-checklist.md) first.

## Pre-flight

- [ ] `node --test` passes.
- [ ] `node build.mjs --zip` produces a clean `dist/opera/` and `dist/opera.zip`.
- [ ] Version bumped in `manifest.json`; `CHANGELOG.md` updated; git tag
      `gpq-vX.Y.Z` created.
- [ ] Privacy policy reachable at its public URL.
- [ ] No `console.log` of any browsing data; no remote resources; no network
      calls.
- [ ] Loaded `dist/opera/` unpacked in Opera and ran the manual checklist
      (onboarding deep-link goes to `opera://extensions` and the "Allow in
      private mode" toggle works).

## Opera add-ons store (addons.opera.com)

- [ ] Opera developer account active (sign in at addons.opera.com → Developer).
- [ ] Manifest V3, `minimum_chrome_version` set (Opera honors it).
- [ ] Permissions = `["storage", "privacy"]` only. No host permissions.
- [ ] **Single purpose**: "Open a private window from the toolbar, with an
      optional Hardened Private Mode that applies session-scoped privacy
      settings to that private window only."
- [ ] Permission justifications ready:
  - `storage` — persists the user's own settings (the three advanced toggles);
    no browsing data.
  - `privacy` — applies the documented hardened settings to the private
    session only (`incognito_session_only` scope); never changes normal
    browsing; never disables security protections; used only when the user
    opens a hardened window.
- [ ] No host permissions requested; no remote code; strict CSP.
- [ ] Data privacy: collects nothing; sells nothing; no use beyond single
      purpose.
- [ ] Listing copy + screenshots from `store-assets/opera-addons/`
      (popup, onboarding/allow-in-private, website-with-popup).
- [ ] Upload `dist/opera.zip`.

## Opera review notes

- Opera reviews each submission manually; turnaround is typically a few days.
- The package is unminified vanilla JS — reviewers can diff `dist/opera/`
  against `src/` + `manifest.json` (see `docs/build-instructions.md`).
- The extension makes zero network requests, which Opera's automated checks
  and manual review both confirm easily.

## Post-submission

- [ ] Tag pushed; release notes drafted from `CHANGELOG.md`.
- [ ] Update the parent CodeCraftedApps site if the public site changed (add an
      Opera install link alongside the Chrome/Firefox ones).
