function execute() {
    return Response.success([
        {
            "title": "Chương mới",
            "script": "gen.js",
            "input": "https://wikisach.net/chuong-moi"
        },
        {
            "title": "Mới cập nhật",
            "script": "gen.js",
            "input": "https://wikisach.net/bang-xep-hang?so=4"
        },
        {
            "title": "Rating",
            "script": "gen.js",
            "input": "https://wikisach.net/bang-xep-hang?tr=1&so=2"
        },
        {
            "title": "Review",
            "script": "review.js",
            "input": "https://wikisach.net/review"
        },
        {
            "title": "Truyện nam",
            "script": "gen.js",
            "input": "https://wikisach.net/truyen-nam"
        },
        {
            "title": "Nữ tần",
            "script": "gen.js",
            "input": "https://wikisach.net/nu-tan"
        },
        {
            "title": "Đam mỹ",
            "script": "gen.js",
            "input": "https://wikisach.net/dam-my"
        }
    ]);
}