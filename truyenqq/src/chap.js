load('bypass.js');
load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let doc = bypass(url, fetch(url).html());
    if (doc) {
        let imgs = doc.select(".chapter_content img.lazy");
        let data = [];
        for (let i = 0; i < imgs.size(); i++) {
            let e = imgs.get(i);
            let link = e.attr("data-original")
            if (link !== undefined) {
                if (link.indexOf("mangaqq.net") > -1 || link.indexOf("cdnqq.xyz") > -1) {
                    link = link.replace("mangaqq.net", "i200.truyenvua.com");
                    link = link.replace("cdnqq.xyz", "i200.truyenvua.com");
                } else if (link.indexOf("mangaqq.com") > -1) {
                    link = link.replace("mangaqq.com", "i216.truyenvua.com");
                } else if (link.indexOf("trangshop.net") > -1 || link.indexOf("photruyen.com") > -1 || link.indexOf("tintruyen.com") > -1) {
                    link = link.replace("photruyen.com", "i109.truyenvua.com");
                    link = link.replace("tintruyen.com", "i109.truyenvua.com");
                    link = link.replace("trangshop.net", "i109.truyenvua.com");
                } else if (link.indexOf("tintruyen.net") > -1) {
                    link = link.replace("//tintruyen.net", "//i138.truyenvua.com");
                    link = link.replace("//i125.tintruyen.net", "//i125.truyenvua.com");
                } else if (link.indexOf("qqtaku.com") > -1) {
                    link = link.replace("qqtaku.com", "i125.truyenvua.com");
                }
            }
            data.push({
                link: e.attr("src"),
                fallback: [link]
            });
        }
        return Response.success(data);
    }
    return null;
}
