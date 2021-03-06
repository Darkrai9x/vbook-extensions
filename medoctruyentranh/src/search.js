function execute(key, page) {

    var htm = Http.get("https://www.medoctruyentranh.net/search/" + key).string();

    if (htm) {
        var data = htm.match(/<script.*?type=\"application\/json\">(.*?)<\/script>/);
        if (data) data = JSON.parse(data[1]);

        var novels = data.props.pageProps.initialState.search.searchResult.storys;

        var covers = [];
        novels.forEach(v => {
            covers.push(v.coverimg);
        })

        var doc = Html.parse(htm);
        var el = doc.select(".listCon a");
        var novelList = [];

        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            novelList.push({
                name: e.select(".storytitle").text(),
                link: e.select("a").attr("href"),
                cover: covers[i],
                host: "https://www.medoctruyentranh.net"
            });
        }

        return Response.success(novelList);

    }
    return null;
}
