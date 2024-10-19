load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html();

    var storyId = doc.select("#storyID").attr("value");

    var chapters = JSON.parse(Http.get(BASE_URL + "/ajax/chapters?storyID=" + storyId).string()).chapters;

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