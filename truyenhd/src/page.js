function execute(url) {
    url = url.replace("truyenvkl.com", "s2.truyenhd.com");
    url = url.replace("s2.truyenhd.com", "s3.truyenhd.com");
    url = url.replace("s3.truyenhd.com", "truyenhd1.com");
    url = url.replace("truyenhd1.com", "truyenhdz.com");
    url = url.replace("truyenhdz.com", "truyenhdd.com");
    url = url.replace("truyenhdd.com", "truyenhdx.com");
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
        list.push(url.replace(/(http|https):\/\/truyenhdx.com/, ""));
    }

    return Response.success(list)
}