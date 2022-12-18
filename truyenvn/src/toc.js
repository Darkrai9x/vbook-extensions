function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, "https://truyenvnhot.com");

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let el = doc.select("#chapterList a")
        const data = [];
        for (let i = el.size() - 1; i >= 0; i--) {
            let e = el.get(i);
            data.push({
                name: e.select("span").first().text(),
                url: e.attr("href"),
                host: "https://truyenvnhot.net"
            });
        }

        return Response.success(data);
    }

    return null;
}