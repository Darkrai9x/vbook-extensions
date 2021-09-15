function execute(url) {
    url = url.replace("webtruyen.com", "dtruyen.com");
    var doc = Http.get(url).html();

    var storyId = doc.select("#storyID").attr("value");

    var chapters = JSON.parse(Http.get("https://dtruyen.com/ajax/chapters?storyID=" + storyId).string()).chapters;

    const data = [];

    chapters.forEach(e => {
        data.push({
            name: e.no,
            url: e.url,
            host: url
        })
    });

    return Response.success(data);
}