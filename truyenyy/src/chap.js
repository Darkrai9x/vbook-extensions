function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let txt = doc.select("div#inner_chap_content_1").html();
        let contentTxt = doc.select("div#inner_chap_content_1").text();
        if (contentTxt && contentTxt.length < 1000) {
            if (doc.html().indexOf("btn_buy") > 0)
                return Response.error(url);
            if (txt.indexOf("/login/") > 0)
                return Response.error(url);

            let id = doc.html().match(/chap_id=(.*?)&/)[1];

            let loadUrl = "https://truyenyy.vip/web-api/novel/chapter-content-get/?chap_id=" + id + "&part=0";
            let content = loadChapterContent(loadUrl);
            txt = ""
            if (content) {
                txt = clearContent(content.content);
                if (content.ok) {
                    loadUrl = "https://truyenyy.vip/web-api/novel/chapter-content-get/?chap_id=" + id + "&part=1";
                    content = loadChapterContent(loadUrl);
                    if (content) {
                        txt += clearContent(content.content);
                        if (content.ok) {
                            loadUrl = "https://truyenyy.vip/web-api/novel/chapter-content-get/?chap_id=" + id + "&part=2";
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
    let response = fetch(url);
    if (response.ok) {
        return response.json();
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
    return "";
}
