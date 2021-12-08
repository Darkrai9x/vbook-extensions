function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: "http://www.nettruyengo.com/tim-truyen", script: "gen.js"},
        {title: "Truyện mới", input: "http://www.nettruyengo.com/tim-truyen?status=-1&sort=15", script: "gen.js"},
        {title: "Top all", input: "http://www.nettruyengo.com/tim-truyen?status=-1&sort=10", script: "gen.js"},
        {title: "Top tháng", input: "http://www.nettruyengo.com/tim-truyen?status=-1&sort=11", script: "gen.js"},
        {title: "Top tuần", input: "http://www.nettruyengo.com/tim-truyen?status=-1&sort=12", script: "gen.js"},
        {title: "Top ngày", input: "http://www.nettruyengo.com/tim-truyen?status=-1&sort=13", script: "gen.js"},
        {title: "Theo dõi", input: "http://www.nettruyengo.com/tim-truyen?status=-1&sort=20", script: "gen.js"},
        {title: "Bình luận", input: "http://www.nettruyengo.com/tim-truyen?status=-1&sort=25", script: "gen.js"}
    ]);
}