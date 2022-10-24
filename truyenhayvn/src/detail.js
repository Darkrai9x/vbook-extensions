function execute(url) {
    url = url.replace(/(www.)?truyenhayvn.com/g, "1.truyenhayvn.com");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h3.comic-title").text(),
            cover: doc.select("div.book img").attr("src"),
            host: "https://1.truyenhayvn.com",
            author: doc.select("a[itemprop=author]").first().text(),
            description: doc.select("div.short-desc").html(),
            detail: doc.select("div.info .meta").html(),
            ongoing: doc.select("div.info").html().indexOf(">Đang cập nhật<") > 0
        });
    }
    return null;
}