function execute(url, page) {
    if (!page) page = '1';

    var htm = Http.get(url + "/" + page).string();

    if (htm) {
        var data = htm.match(/<script.*?type=\"application\/json\">(.*?)<\/script>/);
        if (data) data = JSON.parse(data[1]);

        var novels = data.props.pageProps.initialState.classify.novels;

        var covers = [];
        novels.forEach(v => {
            covers.push(v.coverimg);
        })

        var doc = Html.parse(htm);
        var el = doc.select(".classifyList a");
        var novelList = [];
        var next = doc.select(".page_floor > a.focus + a").text()

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".storytitle").text(),
                link: e.select("a").attr("href"),
                cover: covers[i],
                host: "https://www.medoctruyenchu.net"
            });
        }

        return Response.success(novelList, next);

    }
    return null;
}