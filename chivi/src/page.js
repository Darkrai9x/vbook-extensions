function execute(url) {
    var doc = Http.get(url + "/content").html();
    const pageList = [];
    if (doc) {
        var lastPage = doc.select(".pagi a").last().attr("href");
        const lastPageRegex = /.*page=(\d+)/g;
        const result = lastPageRegex.exec(lastPage);

        if (result) {
            lastPage = result[1];
        } else {
            lastPage = 1;
        }

        for (var i = 1; i <= lastPage; i++) {
            pageList.push(url + "/content?page=" + i);
        }
    }

    return Response.success(pageList);
}