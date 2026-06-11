// Go Private Quickly — onboarding page
//
// Opened automatically on first install (chrome.runtime.onInstalled).
// Detects whether the user has enabled GPQ in private/incognito mode
// and walks them through enabling it if not.
//
// Detection: chrome.extension.isAllowedIncognitoAccess() returns a
// Promise<boolean> on Opera (Chromium-based), same as Chrome.
//
// Opening the settings page: a plain <a href="opera://…"> link is blocked by
// the browser, but an extension may open it itself via chrome.tabs.create.
// We try that on the button click and only reveal the copy-paste fallback if
// it throws (some builds refuse to open internal pages this way).
//   opera://extensions is Opera's "Manage Extensions" page. Unlike Chrome,
//   Opera does not support a ?id= deep-link to a single extension's details,
//   so we open the list and tell the user to find GPQ and flip its
//   "Allow in private mode" toggle.

const SETTINGS_URL = "opera://extensions";
const OPEN_BUTTON_TEXT = "Open Extensions settings";
const TOGGLE_STEP_TEXT =
  "On the Extensions page that opens, find Go Private Quickly and turn on " +
  "\"Allow in private mode.\"";

const pendingEl = document.getElementById("permission-pending");
const grantedEl = document.getElementById("permission-granted");
const missingEl = document.getElementById("permission-missing");
const openPageBtn = document.getElementById("open-settings-page");
const manualFallbackEl = document.getElementById("manual-fallback");
const urlEl = document.getElementById("settings-url");
const copyBtn = document.getElementById("copy-url");
const recheckBtn = document.getElementById("recheck");
const optionsBtn = document.getElementById("open-options");
const stepToggleEl = document.getElementById("step-toggle");

openPageBtn.textContent = OPEN_BUTTON_TEXT;
urlEl.textContent = SETTINGS_URL;
stepToggleEl.textContent = TOGGLE_STEP_TEXT;

function showSection(el) {
  for (const node of [pendingEl, grantedEl, missingEl]) {
    node.hidden = node !== el;
  }
}

async function refreshPermissionStatus() {
  showSection(pendingEl);
  try {
    const allowed = await chrome.extension.isAllowedIncognitoAccess();
    showSection(allowed ? grantedEl : missingEl);
  } catch {
    // API unavailable for some reason — show the instructions as a
    // safe default so the user can still proceed manually.
    showSection(missingEl);
  }
}

openPageBtn.addEventListener("click", async () => {
  try {
    await chrome.tabs.create({ url: SETTINGS_URL });
  } catch {
    // The browser refused to open its internal page from here — reveal the
    // copy-paste fallback so the user can open it manually.
    manualFallbackEl.hidden = false;
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(SETTINGS_URL);
    const original = copyBtn.textContent;
    copyBtn.textContent = "Copied";
    setTimeout(() => { copyBtn.textContent = original; }, 1500);
  } catch {
    // Clipboard write can fail in private contexts or if the document
    // isn't focused. Fall back to selecting the URL so the user can
    // copy manually.
    const range = document.createRange();
    range.selectNodeContents(urlEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
});

recheckBtn.addEventListener("click", refreshPermissionStatus);

optionsBtn.addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  }
});

refreshPermissionStatus();
