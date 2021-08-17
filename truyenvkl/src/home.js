function execute() {
    return Response.success([
        {title: "Truyện hot", script: "hot.js", input: "https://s2.truyenhd.com/truyen HOT top-all"},
        {title: "Truyện sáng tác", script: "hot.js", input: "https://s2.truyenhd.com/truyen-sang-tac SANGTAC new-chap"}
    ])
}