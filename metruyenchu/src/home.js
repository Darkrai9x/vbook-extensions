function execute() {
    return Response.success([
        {title: "Mới cập nhật", script: "gen.js", input: "https://metruyencv.com/truyen?"},
        {title: "Chọn lọc", script: "gen.js", input: "https://metruyencv.com/truyen?sort_by=new_chap_at&props=1"},
        {title: "Thịnh hành", script: "rank.js", input: "https://metruyencv.com/bang-xep-hang/tuan/thinh-hanh"},
        {title: "Đọc nhiều", script: "rank.js", input: "https://metruyencv.com/bang-xep-hang/tuan/doc-nhieu"},
        {title: "Tặng thưởng", script: "rank.js", input: "https://metruyencv.com/bang-xep-hang/tuan/tang-thuong"},
        {title: "Đề cử", script: "rank.js", input: "https://metruyencv.com/bang-xep-hang/tuan/de-cu"},
        {title: "Yêu thích", script: "rank.js", input: "https://metruyencv.com/bang-xep-hang/tuan/yeu-thich"},
        {title: "Thảo luận", script: "rank.js", input: "https://metruyencv.com/bang-xep-hang/tuan/thao-luan"}
    ]);
}
