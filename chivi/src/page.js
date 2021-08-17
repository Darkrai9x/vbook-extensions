function execute(url) {
    var doc = Http.get(url + "/chaps").html();
    const pageList = [];
    if (doc) {
        var lastPage = doc.html().match(/pgmax.*?:(\d+)/);
        if (lastPage) {
            lastPage = parseInt(lastPage[1]);
        } else {
            lastPage = 1;
        }

        for (var i = 1; i <= lastPage; i++) {
            pageList.push(url + "/chaps?page=" + i);
        }
    }

    return Response.success(pageList);
}