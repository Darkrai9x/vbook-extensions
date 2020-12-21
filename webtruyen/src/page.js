function execute(url) {
    var data = [];
    var doc = Http.get(url).html();
    var pg = doc.select(".pagination li")
    var totalPage = 1

    if (pg.size() > 2) {
        totalPage = pg.get(pg.size() - 2).text()
    }

    for (var i = 1; i <= totalPage; i++) {
        data.push(url + "/" + i);
    }

    return Response.success(data)
}