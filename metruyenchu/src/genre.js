function execute() {
    var doc = Html.parse("<a href=\"/truyen?\">Tất cả</a><a href=\"/truyen?genre=2\">Tiên Hiệp</a><a href=\"/truyen?genre=3\">Huyền Huyễn</a><a href=\"/truyen?genre=4\">Khoa Huyễn</a><a href=\"/truyen?genre=5\">Võng Du</a><a href=\"/truyen?genre=6\">Đô Thị</a><a href=\"/truyen?genre=7\">Đồng Nhân</a><a href=\"/truyen?genre=8\">Lịch Sử</a><a href=\"/truyen?genre=9\">Cạnh Kỹ</a><a href=\"/truyen?genre=11\">Huyền Nghi</a><a href=\"/truyen?genre=12\">Kiếm Hiệp</a><a href=\"/truyen?genre=20\">Kỳ Ảo</a>");
    var genre = [];
    if (doc) {
        var el = doc.select("a");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            genre.push({
                title: e.text(),
                input: "https://metruyencv.com" + e.attr("href"),
                script: "gen.js"
            });
        }
        return Response.success(genre);
    }

    return null;
}