   function execute(url) {
    url = url.replace("ln.hako.re","ln.hako.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select(".note-reg").remove();
        htm = doc.select("div#chapter-content");
        htm.select("p.none").remove();
        htm.select('img[src*="/images/banners/"]').remove();
        htm.select('img[src*="/lightnovel/banners/"]').remove();
        htm.select("p:contains(Tham gia Hako Discord tại)").remove();
        htm.select("p:contains(Theo dõi Fanpage Hako tại)").remove();
        htm = htm.html().replace(/<p id=\"\d+\">/g, "<p>").replace(/\[note\d+]/g, "");
        htm = htm.replace(/\&nbsp;/g, "");
        return Response.success(htm);
    }
    return null;
}