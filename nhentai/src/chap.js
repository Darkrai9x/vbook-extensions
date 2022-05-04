function execute(url) {
    let response = fetch(url);
    if (response.ok) {

        let doc = response.html();
        let el = doc.select("div#thumbnail-container div.thumb-container a");
        var mediaServer = /media_server\s*:\s*(\d+)/g.exec(doc.html());
        if (mediaServer) mediaServer = mediaServer[1];
        el.select("noscript").remove();
        let data = [];
        el.forEach(e => {
            data.push(e.select("img").attr("data-src").replace(/t(\d+)?.nhentai.net/g, "i" + mediaServer + ".nhentai.net").replace(/(\d+)t/, "$1"));
        });
        return Response.success(data);
    }
    return null;
}