# Opera Add-ons — Listing Copy

This document is structured so you can copy-paste each field straight
into the Opera add-ons developer dashboard (addons.opera.com →
Developer). This listing is **Opera only** — Chrome and other Chromium
browsers install from the
[Chrome Web Store listing](https://github.com/DJCastle/goPrivateQuickly-Chromium),
and Firefox from AMO.

---

## Item name

> Go Private Quickly

_Currently: 22 chars._

## Short description (summary)

> Open a private window in one click, plus an optional Hardened Mode that tightens privacy for that session only.

## Category

> **Privacy & security** (Opera has a dedicated category; use it. Fallback:
> Productivity.)

## Language

> English

## Detailed description

```
Go Private Quickly does one small thing and tries to do it well: it puts a button in your toolbar that opens a new private window. Click the icon, click the button, you're private. That's the whole idea.

I built it because I open private windows all day and wanted it to be one click instead of a trip through a menu — and because I wanted something that stayed out of the way and didn't quietly phone home. This one never connects to the internet at all.

WHAT YOU GET
- One click to a new private window, straight from the toolbar.
- A toolbar icon that quietly shows whether the window you're in is private.
- An optional "Hardened" mode that opens a private window and tightens a set of privacy settings for that session only: WebRTC IP protection, network prediction, search suggestions, hyperlink auditing, the Topics / ad-measurement / FLEDGE advertising APIs, third-party cookies, and more. Opera puts them all back automatically when the last private window closes, so your normal browsing is never changed — and security protections (Safe Browsing, your password manager, certificate/HTTPS checks, updates) are never touched.
- A few optional Advanced toggles for power users (stricter WebRTC routing, disabling referrer headers) — off by default, each clearly labeled with its trade-off.

WHAT IT HONESTLY DOES NOT DO (I'd rather set expectations than oversell)
- It's not a VPN. Your network, ISP, employer, or school can still see the sites you visit.
- It doesn't hide your IP, block ads or trackers, or make you anonymous.
- It doesn't touch your normal browsing or clear anything.

If you want real anonymity, use Tor. For network privacy, a reputable VPN. For tracker blocking, uBlock Origin. GPQ plays nicely alongside all of them — it just gets you into a private window faster, and optionally tightens the browser's own privacy settings while you're there.

PRIVACY, FOR REAL
- No data collection. None.
- No analytics, no telemetry, no error reporting.
- Zero network requests — the extension never connects to the internet, period.
- Two permissions, both minimal: "storage" (remembers your own settings) and "privacy" (used only to apply the hardening to the private session you open — never to your normal browsing).
- No third-party code, no CDNs, no remote scripts. It's open source, so you can read every line.

ONE-TIME SETUP
By browser security policy, an extension can't switch itself on in private windows. The first time you install, a short welcome page walks you through flipping "Allow in private mode" at opera://extensions. You only do it once.

Open source under the MIT License: https://github.com/DJCastle/goPrivateQuickly-Opera
Questions or problems: support@codecraftedapps.com
Source: https://github.com/DJCastle/goPrivateQuickly-Opera
Privacy Policy: https://codecraftedapps.com/extensions/go-private-quickly/privacy.html
Terms of Use: https://codecraftedapps.com/extensions/go-private-quickly/terms.html
```

## Single purpose description

> Go Private Quickly's single purpose is to open a private browser window from the toolbar, with an optional Hardened Private Mode that applies privacy-hardening settings to that private session only. The extension does not perform any other function.

## Permission justifications

### `storage`

> Used solely to persist the user's own settings (the three advanced Hardened Mode privacy toggles) so they survive browser restarts and sync across the user's own devices via Opera's built-in sync. No personal data or browsing data is stored. Storage is `chrome.storage.sync` with a `chrome.storage.local` fallback if sync is unavailable.

### `privacy`

> Used only by the optional Hardened Private Mode, and only when the user explicitly opens a hardened private window. The extension applies a fixed, documented set of privacy settings (WebRTC IP handling, network prediction, search suggestions, hyperlink auditing, alternate error pages, online spelling service, the Topics/Ad-measurement/Related-Website-Sets/FLEDGE advertising APIs, and third-party cookies) using the `incognito_session_only` scope, so the changes apply to the private session only and the browser clears them automatically when the last private window closes. The user's normal-browsing settings are never changed. Security-related settings (Safe Browsing, password manager, certificate/HTTPS/update/download protections, autofill) are never read or modified. The permission also lets the extension read each setting's `levelOfControl` so it can accurately handle a setting locked by enterprise policy or another extension.

## Host permission justifications

> None — Go Private Quickly does not request host permissions for any website. The extension does not read, modify, or inject anything into web pages.

## Remote code justification

> None — Go Private Quickly does not load or execute remote code. All JavaScript ships in the extension package and runs under the default Manifest V3 Content Security Policy. There is no `eval`, no remote script loading, and no network requests of any kind.

## Data usage / data privacy disclosures

- Collects nothing.
- Does not sell or transfer user data to third parties.
- Does not use or transfer user data for purposes unrelated to the single purpose.

Privacy Policy URL (required field):

> https://codecraftedapps.com/extensions/go-private-quickly/privacy.html

## Screenshots

Three are prepared in this folder (`opera-1.png`, `opera-2.png`,
`opera-3.png`). Suggested upload order and captions:

1. **opera-2.png — private window + popup** — a private-window tab with the GPQ popup open. Caption: "Click → instant private window. Hardened or Standard, your choice."
2. **opera-1.png — Options / Allow in private mode** — the extension's options panel showing Hardened Private Mode and the allow-in-private step. Caption: "Optional Hardened Mode, plus a one-time setup to allow private windows."
3. **opera-3.png — the website + popup** — the popup over the CodeCraftedApps Browser Extensions site. Caption: "Open source, zero tracking, zero network requests."

_Note: the screenshots were captured in a Chromium browser for the Chrome
listing. Recapture in Opera before submitting so the chrome reflects Opera's
UI._

## Search terms / keywords

> private window, incognito, private browsing, one click private, privacy

## Pricing & distribution

- **Visibility:** Public
- **Pricing:** Free
- **Distribution regions:** All regions
- **Mature content:** No
