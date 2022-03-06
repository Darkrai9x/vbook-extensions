function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let data = response.json();
        if (data.code === 200) {
            let bookList = [];
            data.data.rankingList[1].subList[1].list.forEach(novel => {
                bookList.push({
                    name: novel.novel_name,
                    link: "https://www.gongzicp.com/novel-" + novel.novel_id + ".html",
                    cover: novel.novel_cover,
                    description: novel.novel_author,
                });
            });

            return Response.success(bookList);
        }
    }

    return null;
}