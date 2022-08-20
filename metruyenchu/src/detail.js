function execute(url) {
    let response = fetch(url, {
        headers: {
            'user-agent': UserAgent.android()
        }
    });

    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h1").text(),
            cover: doc.select(".nh-thumb--150 img").first().attr("src"),
            host: "https://metruyenchu.com",
            author: doc.select("a[href*=tac-gia]").text(),
            description: doc.select("div#nav-intro .content").html(),
            detail: doc.select("a[href*=tac-gia]").text() + "<br>" + doc.select(".border-danger").text(),
            ongoing: doc.select(".border-danger").text().indexOf("Đang ra") >= 0
        });
    }
    return null;
}
