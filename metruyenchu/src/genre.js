load("config.js")

function execute() {
    return Response.success([
        {
            title: "Tiên Hiệp",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=2&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Huyền Huyễn",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=3&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Khoa Huyễn",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=4&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Võng Du",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=5&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Đô Thị",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=6&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Đồng Nhân",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=7&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Dã Sử",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=8&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Cạnh Kỹ",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=9&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Huyền Nghi",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=11&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Kiếm Hiệp",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=12&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Kỳ Ảo",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=20&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
        {
            title: "Light Novel",
            script: "book.js",
            input: "/api/books?filter%5Bgender%5D=1&filter%5Bgenres.id%5D=22&filter%5Bkind%5D=1&filter%5Bstate%5D=published&include=author%2Cgenres%2Ccreator&sort=-new_chap_at"
        },
    ]);
}