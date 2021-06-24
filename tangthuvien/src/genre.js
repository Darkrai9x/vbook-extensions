function execute() {
    var doc = Html.parse("<a href=\"\">Tất cả</a><a href=\"=1\">Tiên Hiệp</a><a href=\"=2\">Huyền Huyễn</a><a href=\"=3\">Đô Thị</a><a href=\"=4\">Khoa Huyễn</a><a href=\"=5\">Kỳ Huyễn</a><a href=\"=6\">Võ Hiệp</a><a href=\"=7\">Lịch Sử</a><a href=\"=8\">Đồng Nhân</a><a href=\"=9\">Quân Sự</a><a href=\"=10\">Du Hí</a><a href=\"=11\">Cạnh Kỹ</a><a href=\"=12\">Linh Dị</a>");

    var genre = [];
    if (doc) {
        var el = doc.select("a");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            genre.push({
                title: e.text(),
                input: "https://truyen.tangthuvien.vn/tong-hop?ctg" + e.attr("href"),
                script: "gen.js"
            });
        }
        return Response.success(genre);
    }

    return null;
}

