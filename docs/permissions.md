# Permissions & Reviewer Notes — Go Private Quickly

This document explains every permission the extension requests and why it is
required. It is written for store reviewers and privacy-conscious users. The
canonical privacy policy is [`../PRIVACY.md`](../PRIVACY.md).

## Final permission list

This repository ships the **Opera** build. Opera is Chromium-based, so it uses
the same `chrome.privacy` adapter and `incognito_session_only` scope as the
Chromium build.

| Permission | Required for | Notes |
| --- | --- | --- |
| `storage` | Saving the user's own settings | `chrome.storage.sync` with `chrome.storage.local` fallback. No browsing data. |
| `privacy` | Hardened Private Mode | Reads each setting's value + `levelOfControl`, then applies it with `scope: "incognito_session_only"`. Used only when the user opens a hardened window. |

No host permissions. No `tabs`, `activeTab`, `cookies`, `downloads`,
`bookmarks`, `history`, `management`, `proxy`, `webRequest`,
`declarativeNetRequest`, `nativeMessaging`, or clipboard permissions.

> Other Chromium browsers (Chrome, Edge, Brave, Vivaldi, Arc) ship from
> [goPrivateQuickly-Chromium](https://github.com/DJCastle/goPrivateQuickly-Chromium).
> Firefox ships from
> [goPrivateQuickly-Firefox](https://github.com/DJCastle/goPrivateQuickly-Firefox)
> and requests `storage` only — Firefox's `BrowserSetting` API has no
> private-session scope, so it never requests `privacy` and reports each
> hardened protection as "Unavailable in this browser."

## Reviewer note — why each permission is required

- **`storage`** — The only data stored is the user's own preferences (the three
  advanced Hardened Mode toggles). Total size is well under 1 KB. No browsing
  history, URLs, queries, page content, cookies, or identifiers are ever stored.
  Nothing is transmitted.

- **`privacy`** — Hardened Private Mode applies a fixed,
  documented set of privacy protections to the **private session only**, using
  the `incognito_session_only` scope. This scope means: (a) the user's normal
  browsing settings are never changed; (b) the browser clears the values
  automatically when the last private window closes; and (c) because the values
  live only in the incognito session's memory, an unexpected browser exit cannot
  leave a hardened value behind — a fresh launch always starts from the
  browser's own defaults. The permission is also what lets the extension read
  `levelOfControl` so it can honestly report when a setting is controlled by
  enterprise policy or another extension instead of silently failing.

## What Hardened Private Mode never touches

Security protections are explicitly out of scope and are never read or written:
Safe Browsing, phishing/malware protection, certificate validation, HTTPS
protections, browser-update checks, download scanning, password-manager
protections, and autofill. Privacy hardening never reduces browser security.

## No remote code, no network

All code ships in the package. There is no `eval`, no `new Function`, no remote
script loading, no `fetch`/`XMLHttpRequest`/WebSocket, no analytics, telemetry,
or crash reporting. Pages run under an explicit strict CSP
(`script-src 'self'; object-src 'self'`).
