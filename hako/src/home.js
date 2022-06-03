function execute() {
    return Response.success([
        {
            title: "Mới cập nhật",
            script: "gen.js",
            input: "https://ln.hako.vn/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=capnhat"
        },
        {
            title: "Truyện mới",
            script: "gen.js",
            input: "https://ln.hako.vn/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=truyenmoi"
        },
        {
            title: "Theo dõi",
            script: "gen.js",
            input: "https://ln.hako.vn/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=theodoi"
        },
        {
            title: "Top toàn thời gian",
            script: "gen.js",
            input: "https://ln.hako.vn/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=top"
        },
        {
            title: "Top tháng",
            script: "gen.js",
            input: "https://ln.hako.vn/danh-sach?truyendich=1&sangtac=1&convert=1&dangtienhanh=1&tamngung=1&hoanthanh=1&sapxep=topthang"
        }
    ]);
}
