function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");
    var list = [];
    var doc = Http.get(url + "/danh-sach-chuong").html();

    if (doc) {
        var page = doc.select(".pagination").last().select("a");
        if (!page && page.size() > 0)
            page = parseInt(page.get(page.size() - 2).text());
        else page = 1;

        for (var i = 1; i <= page; i++)
            list.push(url + "/danh-sach-chuong/?p=" + i);
        return Response.success(list);
    }

    return null;
}
