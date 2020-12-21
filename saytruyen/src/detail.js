function execute(url) {
    const doc = Http.get(url).html();

    return Response.success({
        name: doc.select("h1.title").first().text(),
        cover: doc.select(".wrap-content-image img").first().attr("src"),
        author: doc.select(".list-info li:nth-child(1)").first().text(),
        description: doc.select(".wrap-detail-taiapp p").html(),
        detail: doc.select(".list-info li:nth-child(2)").html()+'<br>'+doc.select("li.list01").html(),
        host: "https://saytruyen.net",
        ongoing: doc.select(".list-info li:nth-child(1)").text().indexOf("Đang ra") >= 0
    });
}