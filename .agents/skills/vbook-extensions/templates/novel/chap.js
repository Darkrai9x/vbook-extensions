load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    doc.select("SELECTOR_ADS_OR_SCRIPT_TAGS").forEach(function (el) { el.remove(); });

    let title = doc.select("SELECTOR_CHAPTER_TITLE").text();
    let content = doc.select("SELECTOR_CHAPTER_CONTENT").html();

    return Response.success(content, title);
}
