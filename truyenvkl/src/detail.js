function execute(url) {
    url = url.replace("truyenvkl.com", "s2.truyenhd.com");
    url = url.replace("s2.truyenhd.com", "s3.truyenhd.com");
    url = url.replace("s3.truyenhd.com", "truyenhd1.com");
    url = url.replace("truyenhd1.com", "truyenhdz.com");
    url = url.replace("truyenhdz.com", "truyenhdd.com");
    var doc = Http.get(url).html();
    if (doc) {
        return Response.success({
            name: doc.select("h1").text(),
            cover: doc.select(".book3d img").first().attr("data-src"),
            host: "https://truyenhdd.com",
            author: doc.select("a[href*=tac-gia]").first().text(),
            description: doc.select(".gioi_thieu").html(),
            detail: doc.select("#thong_tin").html(),
            ongoing: doc.select("#thong_tin").html().indexOf("Đang Cập Nhật") >= 0
        });
    }
    return null;
}