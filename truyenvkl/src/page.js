function execute(url) {
    var doc = Http.get(url).html();
    var list = [];
    var pages = doc.select(".pagination li");
    var page = 1
    var listChap = doc.select("#dsc");
    if (!listChap.isEmpty()) {
        if (pages.size() > 1) {
            page = pages.get(pages.size() - 2).select("a").attr("href").match(/\/(\d+)/);
            if (page) page = parseInt(page[1]); else page = 1;
        }
        for (var i = 1; i <= page; i++) {
            list.push(url + "/" + i);
        }

    } else {
        list.push(url.replace("(http|https)://truyenvkl.com", ""));
    }

    return Response.success(list)
}