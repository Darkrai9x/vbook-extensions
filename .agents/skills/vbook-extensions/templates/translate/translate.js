// translate.js — return a plain string, or { translateText, segments } for word-level mapping
function execute(text, from, to, source) {
    from = from || "auto";

    let response = fetch("https://engine.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: from, target: to })
    });
    if (!response.ok) return Response.error("HTTP " + response.status);

    return Response.success(response.json().text);
}
