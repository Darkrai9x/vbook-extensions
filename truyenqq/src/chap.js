load('bypass.js');
load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = bypass(url, fetch(url).html());
    if (doc) {
        var imgs = doc.select(".chapter_content img.lazy");
        var data = [];
        for (var i = 0; i < imgs.size(); i++) {
            var e = imgs.get(i)
            data.push({link: e.attr("src")});
        }
        return Response.success(data);
    }
    return null;
}
