function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var page = doc.select("input#total-page").attr("value");
        if (page) page = parseInt(page); else page = 1;
        var list = [];
        for (var i = 1; i <= page; i++) {
            list.push(url + "/?trang=" + i);
        }
        return Response.success(list);
    }

    return null;
}