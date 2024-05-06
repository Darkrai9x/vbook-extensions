load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url, {
        headers: {
            'user-agent': UserAgent.android()
        }
    });

    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select("a[href*=danh-sach].inline-flex").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });
 
        let info = doc.select("button[data-x-bind*=toc]").first().select(".rounded-full").text() +" chương";
        doc.select("div.justify-center.mb-6.text-title > div").forEach(e => {
            info += "<br>" + e.select("div > div").first().text() + " " + e.select("div > div").last().text();
        })
        return Response.success({
            name: doc.select("h1 a.text-lg.text-title").text(),
            cover: doc.select("img.shadow-lg").first().attr("src"),
            host: BASE_URL,
            author: doc.select("a[href*=tac-gia]").first().text(),
            description: doc.select("#synopsis .text-base").html(),
            detail: info,
            ongoing: doc.select("a[href*=danh-sach]").text().indexOf("Còn tiếp") >= 0,
            suggests: [
                {
                    title: "Cùng đăng",
                    input: doc.select("a[href*=ho-so]").attr("href"),
                    script: "recents.js"
                }
            ],
            genres: genres,
        });
    }
    return null;
}
