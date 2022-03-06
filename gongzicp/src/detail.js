function execute(url) {
    let bookId = /-(\d+).html/.exec(url)[1];

    let response = fetch("https://webapi.gongzicp.com/novel/novelGetInfo?id=" + bookId);

    if (response.ok) {
        let data = response.json();
        if (data.code === 200) {
            let novelInfo = data.data.novelInfo;
            return Response.success({
                name: novelInfo.novel_name,
                cover: novelInfo.novel_cover,
                author: novelInfo.author_nickname,
                description: novelInfo.novel_info,
                detail: novelInfo.author_nickname,
                url: "https://www.gongzicp.com/novel-" + bookId + ".html"
            });
        }
    }

    return null;
}