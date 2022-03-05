function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");
    let response = fetch(url + "/danh-sach-chuong");
    if (response.ok) {
        let doc = response.html();

        let pageList = [];
        let isMobile = doc.select("meta[name=mobile-web-app-capable]").attr("content") === "yes";
        if (isMobile) {
            var page = doc.select(".novel-detail > .cell-box").last().select("a");
            if (page && page.size() > 0)
                page = /p=(\d+)/.exec(page.last().attr("href"))[1];
            else page = 1;

            for (let i = 1; i <= page; i++)
                pageList.push(url + "/danh-sach-chuong/?p=" + i);
        } else {
            var page = doc.select(".pagination").last().select("a");
            if (page && page.size() > 0)
                page = parseInt(page.get(page.size() - 2).text());
            else page = 1;

            for (let i = 1; i <= page; i++)
                pageList.push(url + "/danh-sach-chuong/?p=" + i);
        }
        return Response.success(pageList);
    }

    return null;
}
