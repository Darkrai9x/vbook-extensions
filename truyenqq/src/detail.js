load('bypass.js');
load('config.js');

function normalizeCover(url) {
    if (url && url.startsWith("//")) {
        return "https:" + url;
    }
    return url;
}

function buildDetail(doc) {
    var lines = [];
    doc.select(".book_info .list-info li").forEach(function (item) {
        var label = item.select(".name").text().replace(/\s+/g, " ").trim();
        var valueNode = item.select("p").last();
        var value = valueNode.html().replace(/\s+/g, " ").trim();

        if (!label || !value || label === valueNode.text().replace(/\s+/g, " ").trim()) {
            return;
        }

        lines.push("<b>" + label + ":</b> " + value);
    });

    return lines.join("<br>");
}

function getGenres(doc) {
    var genres = [];
    doc.select(".book_info .list01 a").forEach(function (e) {
        genres.push({
            title: e.text(),
            input: e.attr("href"),
            script: "gen.js"
        });
    });
    return genres;
}

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var doc = bypass(url, Http.get(url).html());
    if (doc) {
        var cover = normalizeCover(doc.select(".book_avatar img").first().attr("src"));
        var status = doc.select(".book_info .status").text().replace(/\s+/g, " ").trim();
        return Response.success({
            name: doc.select("h1[itemprop=name]").text(),
            cover: cover,
            host: BASE_URL,
            author: doc.select(".book_info .author a.org").first().text(),
            description: doc.select("div.story-detail-info").html(),
            detail: buildDetail(doc),
            ongoing: status.indexOf("Hoàn Thành") === -1,
            genres: getGenres(doc)
        });
    }

    return null;
}
