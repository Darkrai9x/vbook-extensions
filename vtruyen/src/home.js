function execute() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    return Response.success([
        {
            title: "Truyện mới cập nhật",
            script: "book.js",
            input: "/api/books?filter%5Bkind%5D=2&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Truyện hoàn thành",
            script: "book.js",
            input: "/api/books?filter%5Bkind%5D=2&filter%5Bstate%5D=published&filter%5Bstatus%5D=2&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Bảng xếp hạng lượt đọc",
            script: "rank.js",
            input: "/api/books/ranking?gender=1&kind=2&month=" + currentMonth + "&type=view&year=" + currentYear
        },
        {
            title: "Bảng xếp hạng mở khóa",
            script: "rank.js",
            input: "/api/books/ranking?gender=1&kind=2&month=" + currentMonth + "&type=unlock&year=" + currentYear
        },
        {
            title: "Bảng xếp hạng đề cử",
            script: "rank.js",
            input: "/api/books/ranking?gender=1&kind=2&month=" + currentMonth + "&type=vote&year=" + currentYear
        },
        {
            title: "Bảng xếp hạng tặng thưởng",
            script: "rank.js",
            input: "/api/books/ranking?gender=1&kind=2&month=" + currentMonth + "&type=gift&year=" + currentYear
        },
        {
            title: "Bảng xếp hạng bình luận",
            script: "book.js",
            input: "/api/books/ranking?gender=1&kind=2&month=" + currentMonth + "&type=comment&year=" + currentYear
        },
    ]);
}
