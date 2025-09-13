function execute() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    return Response.success([
        {
            title: "Truyện chọn lọc",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bkind%5D=1&filter%5Bstate%5D=published&filter%5Btype%5D=picked&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Truyện đã bookmark",
            script: "bookmark.js",
            input: "/tai-khoan/tu-truyen"
        },
        {
            title: "Bảng xếp hạng lượt đọc",
            script: "rank.js",
            input: "/api/books/ranking?gender=1&kind=1&month=" + currentMonth + "&type=view&year=" + currentYear
        },
        {
            title: "Bảng xếp hạng đề cử",
            script: "rank.js",
            input: "/api/books/ranking?gender=1&kind=1&month=" + currentMonth + "&type=vote&year=" + currentYear
        },
        {
            title: "Truyện mới cập nhật",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Truyện hoàn thành full",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bkind%5D=1&filter%5Bstate%5D=published&filter%5Bstatus%5D=2&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
    ]);
}
