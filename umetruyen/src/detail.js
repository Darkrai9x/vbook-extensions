function execute(url) {
    const doc = Http.get(url).html();

    var coverImg = doc.select(".detail-top .detail-top-right img").first().attr("src");
    if (coverImg.startsWith("//")) {
        coverImg = "https:" + coverImg;
    }
    return Response.success({
        name: doc.select("h1.comics-title").first().text(),
        cover: coverImg,
        author: doc.select(".created-by").first().text(),
        description: doc.select(".description").html(),
        detail: doc.select(".detail-top .detail-top-left").html(),
        host: "https://umetruyen.com",
        ongoing: true
    });
}