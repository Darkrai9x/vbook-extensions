function execute() {
    return Response.success([
        {title: "Mới cập nhật", script: "gen.js", input: "https://nuhiep.com/truyen?"},
        {title: "Đọc nhiều", script: "rank.js", input: "https://nuhiep.com/bang-xep-hang?rank_type=1&period=1"},
        {title: "Độ ngọt", script: "rank.js", input: "https://nuhiep.com/bang-xep-hang?rank_type=5"},
        {title: "Độ thơm", script: "rank.js", input: "https://nuhiep.com/bang-xep-hang?rank_type=2&period=1"},
        {title: "Thảo luận", script: "rank.js", input: "https://nuhiep.com/bang-xep-hang?rank_type=4&period=1"},
        {title: "Đánh giá", script: "rank.js", input: "https://nuhiep.com/bang-xep-hang?rank_type=3&period=1"}
    ]);
}
