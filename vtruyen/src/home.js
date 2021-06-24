function execute() {
    return Response.success([
        {title: "Thịnh hành", script: "rank.js", input: "https://vtruyen.com/bang-xep-hang?rank_type=6"},
        {title: "Đọc nhiều", script: "rank.js", input: "https://vtruyen.com/bang-xep-hang?rank_type=1&period=2"},
        {title: "Tặng thưởng", script: "rank.js", input: "https://vtruyen.com/bang-xep-hang?rank_type=5&period=2"},
        {title: "Đề cử", script: "rank.js", input: "https://vtruyen.com/bang-xep-hang?rank_type=2&period=2"},
        {title: "Yêu thích", script: "rank.js", input: "https://vtruyen.com/bang-xep-hang?rank_type=4&period=2"},
        {title: "Thảo luận", script: "rank.js", input: "https://vtruyen.com/bang-xep-hang?rank_type=3&period=2"}
    ]);
}
