# Changelog — Go Private Quickly (GPQ)

All notable changes to this extension are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version scheme: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] — 2026-06-11

### Changed

- Refreshed the toolbar mask artwork. A muted silver "secure" mask now marks
  private / Hardened windows; the vivid purple-and-gold mask marks normal
  windows (and is the store listing icon).

### Fixed

- Corrected documentation that described the toolbar icon's colors in reverse
  (it previously said the colorful mask appeared in private windows).

## [1.0.0] — 2026-06-11

First Opera release. Ported from the Chromium build for a first-party
Opera add-ons store listing.

### Added

- **Open Private Window** — one click opens a new private window in Opera.
  The toolbar icon reflects whether the focused window is private.
- **Open Hardened Private Window** (optional) — opens a private window and
  tightens supported privacy settings for that private session only:
  WebRTC IP protection, network prediction, address-bar search suggestions,
  hyperlink auditing, alternate error pages, the online spelling service,
  the Topics / Ad-measurement / Related Website Sets / Protected Audience
  advertising APIs, and third-party cookies.
  - Opera (Chromium-based) applies these with the `incognito_session_only`
    scope, so they affect the private session only and the browser restores
    them automatically when the last private window closes — even after a
    crash. Normal browsing settings are never changed, and security
    protections (Safe Browsing, password manager, certificate/HTTPS checks,
    updates, download scanning) are never touched.
- **Advanced settings** (off by default, each with a warning): strict WebRTC
  routing (`proxy_only`), disable WebRTC entirely (where supported), and
  disable referrer headers.
- **First-run onboarding** that walks through enabling the extension in
  private windows (`opera://extensions` → "Allow in private mode").
- Light and dark theme support; keyboard navigation and screen-reader labels.

### Privacy

- No data collection, no analytics, no telemetry, no network requests, and
  no remote code. Requests `storage` and `privacy` only. Strict Content
  Security Policy.

[1.1.5]: https://github.com/DJCastle/goPrivateQuickly-Opera/releases/tag/gpq-v1.1.5
[1.0.0]: https://github.com/DJCastle/goPrivateQuickly-Opera/releases/tag/gpq-v1.0.0
