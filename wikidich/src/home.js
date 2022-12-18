function execute() {
    return Response.success([
        {
            "title": "Chương mới",
            "script": "gen.js",
            "input": "/chuong-moi"
        },
        {
            "title": "Mới cập nhật",
            "script": "gen.js",
            "input": "/bang-xep-hang?so=4"
        },
        {
            "title": "Rating",
            "script": "gen.js",
            "input": "/bang-xep-hang?tr=1&so=2"
        },
        {
            "title": "Review",
            "script": "review.js",
            "input": "/review"
        },
        {
            "title": "Truyện nam",
            "script": "gen.js",
            "input": "/truyen-nam"
        },
        {
            "title": "Nữ tần",
            "script": "gen.js",
            "input": "/nu-tan"
        },
        {
            "title": "Đam mỹ",
            "script": "gen.js",
            "input": "/dam-my"
        }
    ]);
}