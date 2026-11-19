// BASE_URL is the site base. Hardcode the current default here, then let the DOMAIN
// config key (injected as a const from plugin.json.config) override it when present.
// Scripts use BASE_URL, not DOMAIN directly, so the default still works even if the
// app doesn't inject DOMAIN (the ReferenceError is caught and BASE_URL stays hardcoded).
let BASE_URL = "SELECTOR_BASE_URL";
try {
    if (DOMAIN) {
        BASE_URL = DOMAIN;
    }
} catch (error) {
}

// Rewrite an incoming url's host (old/mirror/www-prefixed) to BASE_URL, keeping
// path/query. Call this first thing in every url-receiving execute(url).
function normalizeUrl(url) {
    return url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
}
