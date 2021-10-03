function execute(url) {
    const doc = Http.get(url).html();

    return Response.success({
        name: doc.select("h1.title").first().text(),
        cover: doc.select(".wrap-content-image img").first().attr("src"),
        author: doc.select(".list-info > li").first().text().replace("Tác giả : ", ""),
        description: doc.select(".detail-content").html(),
        detail: doc.select(".list-info > li").html(),
        host: "https://umetruyen.net",
        ongoing: doc.select(".list-info").text().indexOf("Đang tiến hành") != -1
    });
}