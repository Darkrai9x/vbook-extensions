function execute(url) {
    var doc = Http.get(url).html();
    var lastPage = doc.select("li.nexts > a").first().attr("href")

    if (lastPage) {
        lastPage = lastPage.match(/trang-(\d+)/);
        if (lastPage) lastPage = lastPage[1];
    }

    if (lastPage) lastPage = parseInt(lastPage);
    else lastPage = 1;

    var data = [];
    for (var i = 0; i < lastPage; i++) {
        data.push(url + "/trang-" + (i + 1));
    }

    return Response.success(data)
}