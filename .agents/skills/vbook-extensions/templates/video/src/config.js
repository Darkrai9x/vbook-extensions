// DOMAIN (plugin.json config) overrides the default; try/catch covers it not being injected.
let BASE_URL = "https://site.com";
try {
    if (DOMAIN) BASE_URL = DOMAIN.replace(/\/+$/, "");
} catch (error) {
}

// Move any incoming URL (old/mirror/www host, relative, //host) onto BASE_URL, keeping path/query.
function normalizeUrl(url) {
    if (!url) return BASE_URL;
    if (url.indexOf("//") === 0) url = "https:" + url;
    if (url.charAt(0) === "/") return BASE_URL + url;
    return url.replace(/^https?:\/\/(?:www\.)?[^\/?#]+/i, BASE_URL);
}
