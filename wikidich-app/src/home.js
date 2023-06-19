load('config.js');

function execute() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    return Response.success([
        {
            "title": "Mới hoàn",
            "script": "rank.js",
            "input": "/rank/book?gender=&time_range=0&month=" + currentMonth + "&year=" + currentYear + "&sort=0"
        },
        {
            "title": "Rating",
            "script": "rank.js",
            "input": "/rank/book?gender=&time_range=0&month=" + currentMonth + "&year=" + currentYear + "&sort=2"
        },
        {
            "title": "Đọc nhiều",
            "script": "rank.js",
            "input": "/rank/book?gender=&time_range=0&month=" + currentMonth + "&year=" + currentYear + "&sort=1"
        },
        {
            "title": "Mới nhúng",
            "script": "rank.js",
            "input": "/rank/book?gender=&time_range=0&month=" + currentMonth + "&year=" + currentYear + "&sort=4"
        }
    ]);
}