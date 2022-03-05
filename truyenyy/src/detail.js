function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let isMobile = doc.select("meta[name=mobile-web-app-capable]").attr("content") === "yes";

        if (isMobile) {
            let cover = doc.select(".novel-cover img").attr("src");
            if (!cover) cover = doc.select(".novel-cover img").attr("data-src");
            return Response.success({
                name: doc.select("div.info h1").text(),
                cover: cover,
                host: "http.",
                author: doc.select("div.info a[href~=tac-gia]").text(),
                description: doc.select("#summary_markdown").html(),
                detail: doc.select(".novel-meta").html(),
                ongoing: doc.select(".novel-meta").html().indexOf("Còn tiếp") > -1
            });
        } else {
            let cover = doc.select("div.novel-info img").attr("src");
            if (!cover) cover = doc.select("div.novel-info img").attr("data-src");
            return Response.success({
                name: doc.select("div.info h1").text(),
                cover: cover,
                host: "http.",
                author: doc.select("div.info .author").text(),
                description: doc.select("section#id_novel_summary").html(),
                detail: doc.select("div.info .author").html(),
                ongoing: doc.select("div.info").html().indexOf("status=F") === -1
            });
        }
    }

    return null;
}