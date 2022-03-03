function execute(url, page) {
    if (!page) {
        page = '1';
    }
    let response = fetch(url.replace("1.html", page + ".html"));
    if (response.ok) {
        let doc = response.html('gbk');

        let bookList = [];
        let next = doc.select(".page").select("strong + a").text();
        doc.select(".listRightBottom ul li").forEach(e => {
            bookList.push({
                name: e.select("h2 a").first().text(),
                link: e.select("h2 a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".bookPhrTop").text(),
                host: "http://www.qiushubang.me"
            });
        })
        return Response.success(bookList, next);
    }

    return null;
}