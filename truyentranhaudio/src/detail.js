function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, "https://truyentranhaudio.org");
    const doc = Http.get(url).html();
    var cover = doc.select(".detail-info > div > div.col-xs-4.col-image > img").first().attr("src");
    if (cover.startsWith("//")) {
        cover = "https:" + cover;
    }
    return Response.success({
        name: doc.select("#item-detail > h1").text(),
        cover: cover,
        author: null,
        description: doc.select("#item-detail > div.detail-content").html(),
        detail: null,
        host: "https://truyentranhaudio.org"
    });
}