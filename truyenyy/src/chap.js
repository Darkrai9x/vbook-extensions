function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");
    var doc = Http.get(url).html();

    if (doc) {
        var txt = doc.select("div.inner").html();

        if (txt && txt.length < 1000) {
            if (doc.html().indexOf("btn_buy") > 0)
                return Response.error(url);
            if (txt.indexOf("/login/") > 0)
                return Response.error(url);

            var id = doc.html().match(/chap_id=(.*?)&/)[1];
            var varId = doc.html().match(/chapter-content-get\/(.*?)\//)[1];
            var loadUrl = "https://truyenyy.vip/web-api/novel/chapter-content-get/" + varId + "/?chap_id=" + id + "&part=0";
            var content = loadChapterContent(loadUrl);
            txt = ""
            if (content) {
                txt = clearContent(content.content);
                if (content.ok) {
                    loadUrl = "https://truyenyy.vip/web-api/novel/chapter-content-get/" + varId + "/?chap_id=" + id + "&part=1";
                    content = loadChapterContent(loadUrl);
                    if (content) {
                        txt += clearContent(content.content);
                        if (content.ok) {
                            loadUrl = "https://truyenyy.vip/web-api/novel/chapter-content-get/" + varId + "/?chap_id=" + id + "&part=2";
                            content = loadChapterContent(loadUrl);
                            if (content) {
                                txt += clearContent(content.content);
                            }
                        }
                    }
                }
            }

        }
        return Response.success(txt);
    }
    return null;
}

function loadChapterContent(url) {
    var content = Http.get(url).string();
    if (content) {
        return JSON.parse(content);
    }
    return null;
}

function clearContent(content) {
    if (content) {
        return content
            .replace("<head><\/head><body>", "")
            .replace("<\/body><\/html>", "")
            .replace(/<style>.*?<\/style>/g, "")
            .replace(/<[a-z]{2,} style=.*?>.*?<\/[a-z]{2,}>/g, "")
            .replace(/<\/?[a-z]{2,}>/g, "");
    }
    return content;
}
