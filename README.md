# Go Private Quickly (GPQ) — Opera

> One-click private windows for Opera.
> No tracking. No analytics. No network requests. Open source under MIT.
>
> Other builds:
> [goPrivateQuickly-Chromium](https://github.com/DJCastle/goPrivateQuickly-Chromium)
> (Chrome, Brave, Edge, Arc, Vivaldi) ·
> [goPrivateQuickly-Firefox](https://github.com/DJCastle/goPrivateQuickly-Firefox).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Manifest](https://img.shields.io/badge/manifest-v3-orange)
![Privacy](https://img.shields.io/badge/data%20collection-zero-brightgreen)

## What it does

Click the toolbar icon → a popup with two choices: **Open Hardened
Private Window** or **Standard Private Window** (a normal private window,
nothing else changed). That's the core idea.

**Hardened Private Mode** opens a private window and tightens supported
privacy settings for that private session only — WebRTC IP protection,
network prediction, search suggestions, hyperlink auditing, the
Topics/Ad-measurement/Related-Website-Sets/FLEDGE advertising APIs,
third-party cookies, and more. Opera (Chromium-based) applies them with
the `incognito_session_only` scope and restores them automatically when
the last private window closes; your normal browsing settings are never
changed and security protections are never touched. Optional advanced
toggles (strict/disabled WebRTC, no referrer headers) are off by default.

The toolbar icon also reflects whether the currently focused window is
private — a muted silver mask when you're in a normal window, a vivid
purple-and-yellow mask when you're in a private one.

## What it does NOT do

GPQ is a convenience tool, not a privacy product. It does not:

- Act as a VPN. Your ISP, employer, school, and any network observer
  can still see the sites you visit.
- Hide your IP address.
- Block trackers, ads, or fingerprinting.
- Clear cookies or history from your normal windows.
- Sync settings to a "GPQ account" — there is no such thing. The only
  syncing is Opera's own sync.
- Connect to the internet for any reason. There are no `fetch` or
  `XMLHttpRequest` calls anywhere in the source.

For genuine privacy beyond what private mode itself gives you, look
at uBlock Origin (tracker blocking), a reputable VPN (network-level
privacy), HTTPS-Only mode, and DNS-over-HTTPS. GPQ doesn't replace any
of those.

## Install

- **Opera:** install from the
  [Opera add-ons store](https://addons.opera.com/). _(Store listing
  pending v1.0.)_

Using Chrome or another Chromium browser? See
[goPrivateQuickly-Chromium](https://github.com/DJCastle/goPrivateQuickly-Chromium).
Using Firefox? See
[goPrivateQuickly-Firefox](https://github.com/DJCastle/goPrivateQuickly-Firefox).

In the meantime you can build and load it from source — see
[docs/build-instructions.md](docs/build-instructions.md).

### One quick post-install step

By browser security policy, extensions can't enable themselves in
private mode. The first time you install GPQ it opens a welcome page
that walks you through the one-time toggle:

- Open `opera://extensions`, find **Go Private Quickly**, and turn on
  **Allow in private mode**.

Without that toggle, GPQ can technically run from a normal window but
can't open private ones on your behalf.

## Permissions

`"storage"` plus `"privacy"`. The `privacy` permission is used only by
Hardened Private Mode, and only to apply privacy-hardening to the private
session you explicitly open (with the `incognito_session_only` scope, so it
never changes normal browsing).

GPQ does not request and does not have access to your tabs, history,
cookies, bookmarks, downloads, any specific websites, or any VPN/other
installed software. Full justification lives in
[`docs/permissions.md`](docs/permissions.md) and the
[Privacy Policy](https://codecraftedapps.com/extensions/go-private-quickly/privacy.html).

## Settings

| Setting | What it does | Default |
| --- | --- | --- |
| Advanced: strict WebRTC routing (`proxy_only`) | Stricter WebRTC; may break calls/meetings | Off |
| Advanced: disable WebRTC entirely | Where supported; may break real-time communication | Off |
| Advanced: disable referrer headers | Where supported; may break some sites/sign-in/payment | Off |

All three advanced toggles are off by default; each is labeled with its
trade-off.

## Browser support

| Browser | Minimum version |
| --- | --- |
| Opera | Chromium 109+ (Opera 95+) |

Chrome / Brave / Edge / Arc / Vivaldi ship from the
[goPrivateQuickly-Chromium](https://github.com/DJCastle/goPrivateQuickly-Chromium)
repo; Firefox (115+, incl. ESR) from the
[goPrivateQuickly-Firefox](https://github.com/DJCastle/goPrivateQuickly-Firefox)
repo.

Tested on macOS as of 1.0.0. Should work on Windows and Linux equally
— the extension uses only standard, cross-platform `chrome.*` APIs.
If you find an OS-specific bug, please email support.

## License

Released under the MIT License. See [LICENSE](LICENSE) at the
repo root or [codecraftedapps.com/extensions/license.html](https://codecraftedapps.com/extensions/license.html).

## Author and support

Built by Don Castle.

- Website: [codecraftedapps.com/extensions](https://codecraftedapps.com/extensions)
- Email: [support@codecraftedapps.com](mailto:support@codecraftedapps.com)
- Privacy Policy: [codecraftedapps.com/extensions/go-private-quickly/privacy](https://codecraftedapps.com/extensions/go-private-quickly/privacy.html)
- Terms of Use: [codecraftedapps.com/extensions/go-private-quickly/terms](https://codecraftedapps.com/extensions/go-private-quickly/terms.html)

GPQ is a side project. I plan to keep it working as browsers evolve,
but there's no service-level commitment — see the
[Terms of Use](TERMS.md) for the formal version of that disclaimer.
