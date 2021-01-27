function execute(url) {
    const doc = Http.get(url).html();
    var coverImg = doc.select(".bookImg img").first().attr("src");
    if (coverImg.startsWith("//")) {
        coverImg = "https:" + coverImg;
    }
    return Response.success({
        name: doc.select(".jieshao_content h1").text().replace("最新章节", ""),
        cover: coverImg,
        author: doc.select(".jieshao_content h2 a").first().text(),
        description: doc.select(".jieshao_content h3").text(),
        detail: doc.select(".jieshao_content h2 a").html(),
        host: "https://www.uukanshu.com"
    });
}