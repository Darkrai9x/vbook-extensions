function execute(url) {
    url = url.replace("chivi.xyz", "chivi.app");
    var doc = Http.get(url + "/chaps").html();
    const pageList = [];
    if (doc) {
        var story = doc.html().match(/api\/chaps\/(\d+\/[a-z_]+)/)[1];
        var lastPage = doc.html().match(/pgmax.*?:(\d+)/);
        if (lastPage) {
            lastPage = parseInt(lastPage[1]);
        } else {
            lastPage = 1;
        }

        for (var i = 1; i <= lastPage; i++) {
            pageList.push(url + " https://chivi.app/api/chaps/" + story + "?page=" + i);
        }
    }

    return Response.success(pageList);
}