load('bypass.js');

function execute(url) {
    url = url.replace("truyenqq.com", "truyenqq.net");
    url = url.replace("truyenqq.net", "truyenqqtop.com");
    url = url.replace("truyenqqtop.com", "truyenqqvip.com");
    url = url.replace("truyenqqvip.com", "truyenqqpro.com");
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
