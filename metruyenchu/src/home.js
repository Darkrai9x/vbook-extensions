function execute() {
    return Response.success([
        {title: "Mới cập nhật", script: "gen.js", input: "https://metruyenchu.com/truyen?"},
        {title: "Đọc nhiều", script: "rank.js", input: "https://metruyenchu.com/bang-xep-hang?rank_type=1&period=1"},
        {title: "Tặng thưởng", script: "rank.js", input: "https://metruyenchu.com/bang-xep-hang?rank_type=5&period=1"},
        {title: "Đề cử", script: "rank.js", input: "https://metruyenchu.com/bang-xep-hang?rank_type=2&period=1"},
        {title: "Yêu thích", script: "rank.js", input: "https://metruyenchu.com/bang-xep-hang?rank_type=4&period=1"},
        {title: "Đánh giá", script: "rank.js", input: "https://metruyenchu.com/truyen?sort_by=review_count"},
        {title: "Thảo luận", script: "rank.js", input: "https://metruyenchu.com/bang-xep-hang?rank_type=3&period=1"}
    ]);
}
