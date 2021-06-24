function execute() {
    return Response.success([
        {title: "Xem nhiều", script: "gen.js", input: "https://truyen.tangthuvien.vn/tong-hop?rank=vw"},
        {title: "Đề cử", script: "gen.js", input: "https://truyen.tangthuvien.vn/tong-hop?rank=nm"},
        {title: "Bình luận nhiều", script: "gen.js", input: "https://truyen.tangthuvien.vn/tong-hop?rank=bl"},
        {title: "Theo dõi nhiều", script: "gen.js", input: "https://truyen.tangthuvien.vn/tong-hop?rank=td"}
    ]);
}