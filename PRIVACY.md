# Privacy Policy — Go Private Quickly (GPQ)

**Last updated:** May 30, 2026

## The short version

Go Private Quickly does not collect, store, transmit, sell, share, or
otherwise process any personal data. No analytics. No tracking. No
telemetry. No network requests at all. The only thing it remembers is
your own settings, and those live exclusively in your browser.

If you're the kind of person who only reads the short version, you're
done. Thanks for caring about privacy.

## The slightly longer version

I built Go Private Quickly because I wanted a single-click way to open
a new private/incognito window. That is the entire purpose of the
extension. To do that, GPQ needs exactly one thing from your browser:
the ability to remember whether you want a private window to open
automatically when the browser starts, or whether you'd rather be
asked first.

That preference is stored using `chrome.storage.sync` (with a fallback
to `chrome.storage.local` if your browser sync is unavailable). It
never leaves your device, never leaves your browser, and never reaches
me or anyone else.

## What we collect

Nothing.

## What we store on your device

A handful of small settings, totalling well under one kilobyte:

| Setting | Values | Default |
| --- | --- | --- |
| `advStrictWebrtc` | `true` / `false` | `false` |
| `advDisableWebrtc` | `true` / `false` | `false` |
| `advDisableReferrers` | `true` / `false` | `false` |

These three are the **Hardened Private Mode** advanced toggles. They record
only your own on/off preferences for the advanced privacy options. They never
describe anything you browse.

If you've signed into Opera's sync, these settings travel with you between
your own devices. That sync happens through Opera's infrastructure, under
their privacy policy, not mine. GPQ doesn't operate or have access to those
servers.

There's also one tiny key in `chrome.storage.local` called
`onboardingShown`, which is just a flag so the welcome page doesn't
re-open every time you reload the extension during development.

## What we transmit

Nothing. There are no network requests in the extension's code. No
`fetch`, no `XMLHttpRequest`, no WebSocket, no image beacons, no
third-party SDKs, no remote scripts, no CDN, no Google Fonts.
Nothing.

If you want technical confirmation, the extension's permissions list
in your browser's extension manager will show that GPQ requests only
the `storage` permission and no host permissions at all — your
browser itself won't let it read or transmit page data even if it
wanted to.

The only "external" links you'll see are in the options page and
onboarding page footers — links to this website and a `mailto:` link
to the support email. Those links only do anything when *you* click
them. Until then, no requests are made.

## What permissions GPQ requests, and why

On **Opera**, two:

- `"storage"` — to save the settings above.
- `"privacy"` — used **only** by Hardened Private Mode, and **only** to
  apply privacy-hardening to the private session you explicitly open.
  GPQ writes these settings with the browser's *incognito-session-only*
  scope, so they affect the private session alone and the browser clears
  them automatically when the last private window closes. GPQ never
  changes your normal-browsing privacy settings. The `privacy` permission
  also lets GPQ read each setting's level of control, so it can tell
  whether a protection was applied, already on, unavailable, or blocked by
  policy or another extension — instead of silently failing.

GPQ does not request, and does not have access to:

- Your browsing history
- Your tabs' URLs or content
- Your cookies, cache, or downloads
- Your bookmarks
- Any specific websites (no host permissions)
- Your location, microphone, camera, or any other sensor
- Any VPN software, installed applications, or other extensions
- Anything else

GPQ never disables your security protections. Safe Browsing, phishing and
malware protection, certificate and HTTPS checks, browser updates, download
scanning, and your password manager are never touched by Hardened Private
Mode.

## Third parties

There are no third parties. No analytics provider, no error-reporting
service, no payment processor, no ad network, no CDN. GPQ is a single
self-contained extension with no external dependencies at runtime.

## Children

GPQ doesn't collect anything from anyone, so there's nothing
child-specific to disclose. It's safe for any age group that's old
enough to use a web browser.

## Changes to this policy

If this policy ever changes, the updated version will live at the same
URL ([codecraftedapps.com/extensions/go-private-quickly/privacy](https://codecraftedapps.com/extensions/go-private-quickly/privacy.html))
with a new "Last updated" date at the top. Material changes will be
called out in the changelog of any release that introduces them.

## Contact

If you have a privacy question or want to verify any of the above,
email me at [support@codecraftedapps.com](mailto:support@codecraftedapps.com).
