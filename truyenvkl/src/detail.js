function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        return Response.success({
            name: doc.select("h1").text(),
            cover: doc.select(".book3d img").first().attr("data-src"),
            host: "https://truyenvkl.com",
            author: doc.select(".thong_tin a").first().text(),
            description: doc.select(".gioi_thieu").html(),
            detail: doc.select(".thong_tin p").html(),
            ongoing: doc.select(".thong_tin").html().indexOf("Đang Cập Nhật") >= 0
        });
    }
    return null;
}