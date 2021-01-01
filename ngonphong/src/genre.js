function execute() {
    const htm = "<a href=\"https://www.ngonphong.com/the-loai/bach-hop/\">Bách Hợp</a> <a href=\"https://www.ngonphong.com/the-loai/bao-thu/\">Báo Thù</a> <a href=\"https://www.ngonphong.com/the-loai/bi-kich/\">Bi Kịch</a> <a href=\"https://www.ngonphong.com/the-loai/co-dai/\">Cổ Đại</a> <a href=\"https://www.ngonphong.com/the-loai/cung-dau/\">Cung Đấu</a> <a href=\"https://www.ngonphong.com/the-loai/dam-my/\">Đam Mỹ</a> <a href=\"https://www.ngonphong.com/the-loai/dien-van/\">Điền Văn</a> <a href=\"https://www.ngonphong.com/the-loai/do-thi/\">Đô Thị</a> <a href=\"https://www.ngonphong.com/the-loai/gioi-giai-tri/\">Giới Giải Trí</a> <a href=\"https://www.ngonphong.com/the-loai/hac-dao/\">Hắc Đạo</a> <a href=\"https://www.ngonphong.com/the-loai/hai-huoc/\">Hài Hước</a> <a href=\"https://www.ngonphong.com/the-loai/hao-mon-the-gia/\">Hào Môn Thế Gia</a> <a href=\"https://www.ngonphong.com/the-loai/huyen-huyen/\">Huyền Huyễn</a> <a class=\"owl-tag\" href=\"https://www.ngonphong.com/the-loai/ngon-tinh/\">Ngôn Tình</a> <a href=\"https://www.ngonphong.com/the-loai/nguoc/\">Ngược</a> <a href=\"https://www.ngonphong.com/the-loai/nhan-thu/\">Nhân Thú</a> <a href=\"https://www.ngonphong.com/the-loai/nu-cuong/\">Nữ Cường</a> <a href=\"https://www.ngonphong.com/the-loai/quan-nhan/\">Quân Nhân</a> <a href=\"https://www.ngonphong.com/the-loai/su-do-luyen/\">Sư Đồ Luyến</a> <a href=\"https://www.ngonphong.com/the-loai/sung/\">Sủng</a> <a href=\"https://www.ngonphong.com/the-loai/thanh-xuan-vuon-truong/\">Thanh Xuân Vườn Trường</a> <a href=\"https://www.ngonphong.com/the-loai/tien-hon-hau-ai/\">Tiền Hôn Hậu Ái</a> <a href=\"https://www.ngonphong.com/the-loai/trach-dau/\">Trạch Đấu</a> <a href=\"https://www.ngonphong.com/the-loai/trinh-tham/\">Trinh Thám</a> <a href=\"https://www.ngonphong.com/the-loai/trong-sinh/\">Trọng Sinh</a> <a href=\"https://www.ngonphong.com/the-loai/tu-tien/\">Tu Tiên</a> <a href=\"https://www.ngonphong.com/the-loai/vong-du/\">Võng Du</a> <a href=\"https://www.ngonphong.com/the-loai/xuyen-khong/\">Xuyên Không</a>";
    const doc = Html.parse(htm);
    const el = doc.select("a");
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            title: e.text(),
            input: e.attr("href"),
            script: "gen.js"
        });

    }
    return Response.success(data);
}