function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select(".note-reg").remove();
        htm = doc.select("div#chapter-content");
        htm.select("p.none").remove();
        htm = htm.html().replace(/<p id=\"\d+\">/g, "<p>").replace(/\[note\d+]/g, "")
        return Response.success(htm);
    }
    return null;
}