function execute(url) {
    var htm = Http.get(url).string();
    if (htm) {
        var htm = htm.match(/api\/services\/list-chapter.*?({.*?})/);

        if (htm) {
            var js = htm[1];
            var tid = js.match(/tid:\s*(\d+)/)[1];
            var tascii = js.match(/tascii:\s*'(.*?)'/)[1];
            var tname = js.match(/tname:\s*'(.*?)'/)[1];
            var data = null;
            var page = 1;
            var chapList = [];
            do {
                data = loadChapterList(tid, tascii, tname, page);

                if (data) {
                    var el = Html.parse(data.chap_list).select("a");
                    for (var i = 0; i < el.size(); i++) {
                        var e = el.get(i);
                        chapList.push({
                            name: e.text(),
                            url: e.attr("href"),
                            host: "https://truyenchu.vn"
                        });
                    }
                    var pageList = Html.parse(data.page_list);

                    page = pageList.select("li.active + li");

                    if (page) {
                        page = parseInt(page.select("a").text()) || 0;
                    }
                }

            } while (page)
        }
        return Response.success(chapList);
    }
    return null;
}

function loadChapterList(tid, tascii, tname, page) {
    var data = Http.get("https://truyenchu.vn/api/services/list-chapter")
        .params({
            type: 'list_chapter',
            tid: tid,
            tascii: tascii,
            page: page,
            totalp: 0
        }).string();

    if (data)
        return JSON.parse(data);
    return null;
}