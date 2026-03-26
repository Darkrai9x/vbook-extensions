load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var doc = Http.get(url).html();
    if (doc) {
        var coverEl = doc.select(".series-cover .img-in-ratio").first();
        var cover = "";
        if (coverEl) {
            var style = coverEl.attr("style");
            var matchedCover = style ? style.match(/url\(['"]?(.*?)['"]?\)/i) : null;
            if (matchedCover) cover = matchedCover[1];
        }

        var infoItems = doc.select(".series-information .info-item");
        var genres = doc.select(".series-gernes");
        var genreList = [];
        var detailParts = [];
        if (genres && genres.size() > 0) {
            var genreLinks = genres.select(".series-gerne-item[href]");
            for (var g = 0; g < genreLinks.size(); g++) {
                var genreLink = genreLinks.get(g);
                var genreTitle = genreLink.text();
                genreList.push({
                    title: genreTitle,
                    input: genreLink.attr("href"),
                    script: "gen.js"
                });
            }
            if (genreList.length > 0) {
                var genreNames = [];
                for (var j = 0; j < genreList.length; j++) {
                    genreNames.push(genreList[j].title);
                }
                detailParts.push("<b>Thể loại:</b> " + genreNames.join(", "));
            }
        }

        var author = "";
        var ongoing = false;
        var comments = [];
        for (var i = 0; i < infoItems.size(); i++) {
            var item = infoItems.get(i);
            var label = item.select(".info-name").text().toLowerCase();
            var value = item.select(".info-value");
            var valueText = value.text().toLowerCase();
            var valueHref = value.select("a").first() ? value.select("a").first().attr("href") : "";

            if (!author && label.indexOf("tác giả") !== -1) {
                author = value.text();
            }

            if (label.indexOf("tình trạng") !== -1) {
                ongoing = valueHref.indexOf("truyen-dang-tien-hanh") !== -1
                    || valueText.indexOf("đang tiến hành") !== -1;
            }

            detailParts.push("<b>" + item.select(".info-name").text() + "</b> " + value.text());
        }

        var detail = detailParts.join("<br>");
        var commentsLink = doc.select('a[href*="#series-comments"]').first();
        if (commentsLink) {
            comments.push({
                title: "Bình luận",
                input: commentsLink.attr("href"),
                script: "comment.js"
            });
        }

        return Response.success({
            name: doc.select(".series-name").text(),
            cover: cover,
            host: BASE_URL,
            author: author,
            description: doc.select(".summary-content").html(),
            genres: genreList,
            detail: detail,
            ongoing: ongoing,
            comments: comments
        });
    }
}
