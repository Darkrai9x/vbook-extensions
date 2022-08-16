function execute(url) {
    url = url.replace("sstruyen.com", "sstruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var lastPage = doc.select("li.nexts > a").first().attr("href");

        if (lastPage) {
            lastPage = lastPage.match(/trang-(\d+)/);
            if (lastPage) lastPage = lastPage[1];
        }

        if (lastPage) lastPage = parseInt(lastPage);
        else lastPage = 1;

        const data = [];
        for (var i = 0; i < lastPage; i++) {
            data.push(url + "/trang-" + (i + 1));
        }

        return Response.success(data);
    }

    return null;
}