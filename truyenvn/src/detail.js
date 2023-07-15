load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL)

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select(".info .genre a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        let detail = "";
        detail += doc.select(".info .time_small").text();
        let newChapter = doc.select(".chapter_new").text();
        if (newChapter) {
            detail += "<br>" + newChapter;
        }
        let otherName = doc.select(".other_name").text();
        if (otherName) {
            detail += "<br>" + otherName;
        }
        let newChap = doc.select(".new-chap").text();
        if (newChap) {
            detail += "<br>" + newChap;
        }
        let viewTimes = doc.select(".view-times").text();
        if (viewTimes) {
            detail += "<br>" + viewTimes;
        }


        return Response.success({
            name: doc.select("h1.name").first().text(),
            cover: doc.select(".book img").first().attr("src"),
            author: doc.select(".author a").first().text(),
            description: doc.select(".comic-description .inner").html(),
            detail: detail,
            ongoing: doc.select(".status").text().indexOf("Đang Cập Nhật") >= 0,
            genres: genres,
            suggests: [
                {
                    title: "Có thể bạn quan tâm",
                    input: doc.select(".form-row.mb-8").html(),
                    script: "suggest.js"
                }
            ],
            comment: {
                input: doc.select("input[name=cat]").attr("value"),
                script: "comment.js"
            },
            host: BASE_URL
        });
    }

    return null;
}