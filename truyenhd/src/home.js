function execute() {
    return Response.success([
        {title: "Truyện dịch", script: "hot.js", input: "https://truyenhdx.com/truyen-dich DICHEDIT new-chap"},
        {title: "Truyện sáng tác", script: "hot.js", input: "https://truyenhdx.com/truyen-sang-tac SANGTAC new-chap"}
    ])
}