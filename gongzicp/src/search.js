function execute(key, page) {

    let bookList = [];

    // novelAndAuthor
    let response = fetch("https://webapi.gongzicp.com/search/novelAndAuthor?k=" + key);
    if (response.ok) {
        let data = response.json();
        if (data.code === 200) {
            if (data.data.novel && data.data.novel.novel_id) {
                let novel = data.data.novel;
                bookList.push({
                    name: novel.novel_name,
                    link: "https://www.gongzicp.com/novel-" + novel.novel_id + ".html",
                    cover: novel.novel_cover,
                    description: novel.novel_author,
                });
            }
        }
    }

    response = fetch("https://webapi.gongzicp.com/search/novels?k=" + key);
    if (response.ok) {
        let data = response.json();
        if (data.code === 200) {
            data.data.list.forEach(novel => {
                bookList.push({
                    name: novel.novel_name,
                    link: "https://www.gongzicp.com/novel-" + novel.novel_id + ".html",
                    cover: novel.novel_cover,
                    description: novel.novel_author,
                });
            });
        }
    }

    return Response.success(bookList);
}