// Return a string, or { text, segments } for word-level mapping. from "" = app's auto-detect.
function execute(text, from, to, source, model, style) {
    from = from || "auto";
    source = source || "";
    model = model || "";
    style = style || "";

    let response = fetch("https://engine.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: from, target: to, model: model, style: style })
    });
    if (!response.ok) return Response.error("HTTP " + response.status);

    return Response.success(response.json().text);
}
