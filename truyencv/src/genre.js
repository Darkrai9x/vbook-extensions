function execute() {
    var doc = Html.parse("<a href=\"tien-hiep\">Tiên Hiệp</a><a href=\"kiem-hiep\">Kiếm Hiệp</a><a href=\"do-thi\">Đô Thị</a><a href=\"huyen-ao\">Huyền Ảo</a><a href=\"ngon-tinh\">Ngôn Tình</a><a href=\"di-nang\">Dị Năng</a><a href=\"vong-du\">Võng Du</a><a href=\"di-gioi\">Dị Giới</a><a href=\"khoa-huyen\">Khoa Huyễn</a><a href=\"quan-su\">Quân Sự</a><a href=\"lich-su\">Lịch Sử</a><a href=\"xuyen-khong\">Xuyên Không</a><a href=\"trung-sinh\">Trùng Sinh</a><a href=\"canh-ky\">Cạnh Kỹ</a><a href=\"dong-nhan\">Đồng Nhân</a><a href=\"linh-di\">Linh Dị</a><a href=\"mat-the\">Mạt Thế</a><a href=\"nu-hiep\">Nữ Hiệp</a>");
    var genre = [];

    var el = doc.select("a")
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        genre.push({
            title: e.text(),
            input: "https://truyencv.com/" + e.attr("href"),
            script: "gen.js"
        });
    }

    return Response.success(genre);
}
