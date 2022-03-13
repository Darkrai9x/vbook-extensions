function execute(url, page) {

    let response = page ? fetch(page + "/") : fetch(url + "/");
    if (response.ok) {
        let doc = response.html('gbk');
        let bookList = [];
        let next = doc.select(".page").select("a:contains(下页)").attr("href");
        if (next) {
            next = "http://m.shubao45.com" + next;
        }
        doc.select(".cover .line").forEach(e => {
            bookList.push({
                name: e.select("a.blue").first().text(),
                link: e.select("a.blue").first().attr("href"),
                description: e.select("a[href~=author]").text(),
                host: "http://m.shubao45.com"
            });
        });
        return Response.success(bookList, next);
    }

    return null;
}