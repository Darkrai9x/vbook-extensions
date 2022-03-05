function execute(url, page) {
    if (!page) {
        page = '1';
    }
    let response = fetch(url + "/" + page + ".html");
    if (response.ok) {
        let doc = response.html('gbk');

        let bookList = [];
        let next = doc.select("#pagelink").select("strong + a").text();
        doc.select(".books-list li").forEach(e => {
            bookList.push({
                name: e.select("a .text").first().text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".author").text().replace("作者：", ""),
                host: "https://www.keepshu.com"
            });
        })
        return Response.success(bookList, next);
    }

    return null;
}