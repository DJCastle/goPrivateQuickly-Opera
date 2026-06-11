# Testing Checklist — Go Private Quickly (Hardened Private Mode)

Manual checklist plus the automated suite. Run before every store submission.

## Automated tests

```
# from the repo root
node --test
```

Covers the declarative setting builder and the Chromium privacy adapter
decision logic (applied / already-protected / blocked / unavailable / failed)
with a mocked `chrome.privacy`. Opera is Chromium-based, so it uses the same
adapter. Browser-integration behavior is manual.

## Build

```
node build.mjs
# load dist/opera/ unpacked in Opera (opera://extensions → Developer mode → Load unpacked)
```

## Browsers to cover

- [ ] Opera (current stable)
- [ ] Opera GX (if available)

## Functional tests

- [ ] **Standard Private Window** opens a normal private window with no
      settings changed.
- [ ] Toolbar click opens the popup; **Open Hardened Private Window** is
      focused so Enter triggers it immediately.
- [ ] **Open Hardened Private Window** opens a private window, applies the
      hardened settings, brings the window to the front, and closes the popup.
- [ ] If GPQ is **not yet allowed in private mode**, the hardened action opens
      the onboarding page instead of half-applying.
- [ ] Multiple private windows can be opened safely; opening a second hardened
      window does not error.
- [ ] Hardened settings remain active while any private window is open. Verify
      e.g. a WebRTC leak test page reflects the hardened value inside the
      private session.
- [ ] Settings restore automatically when the **last** private window closes —
      normal windows show the original values.
- [ ] After closing all private windows and restarting Opera, no hardened value
      persists (fresh session starts at browser defaults).
- [ ] Force-quit Opera mid-hardened-session, relaunch: no hardened value
      persists in normal browsing (incognito-session-only is memory-only).
- [ ] Normal (non-private) browsing settings remain unchanged throughout.
- [ ] A setting controlled by **enterprise policy** or **another extension** is
      handled gracefully (the rest still apply), not a crash.
- [ ] Unsupported settings (e.g. a missing API path) are skipped without
      crashing.

## Onboarding

- [ ] On first install the welcome page opens automatically (once).
- [ ] "Open Extensions settings" opens `opera://extensions` (or reveals the
      copy-paste fallback if Opera refuses).
- [ ] After enabling "Allow in private mode," **Re-check** flips the page to the
      "You're all set" state.

## Advanced options

- [ ] All three advanced toggles are **off** by default.
- [ ] Each advanced toggle shows its warning text.
- [ ] Strict WebRTC routing applies `proxy_only` when enabled.
- [ ] "Disable WebRTC entirely" shows the not-available note (no Chromium API).
- [ ] Disable referrer headers applies when enabled.
- [ ] Advanced preferences persist across browser restarts.

## Privacy & data hygiene

- [ ] No external network requests anywhere (DevTools → Network, popup +
      background + options).
- [ ] No private-window URLs are stored in sync/local/session storage.
- [ ] No private-window URLs appear in console logs.
- [ ] No remote resources (scripts, fonts, images) are loaded.
- [ ] Storage contains only the three documented advanced-toggle keys.

## Accessibility

- [ ] Full keyboard navigation of the popup (Tab order, Enter, Esc).
- [ ] Advanced `<details>` summary and all controls are reachable and labeled.
- [ ] Onboarding controls are reachable and labeled for screen readers.
