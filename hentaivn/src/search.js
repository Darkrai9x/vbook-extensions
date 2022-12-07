function execute(key, page) {
    if (!page) page = '1';
    let response = fetch("https://hentaivn.in/tim-kiem-truyen.html" + "?key=" + key + "&page=" + page);

    if (response.ok) {

        let doc = response.html();

        let isMobile = doc.select(".header-logo").size() !== 0;
        let next = doc.select(".pagination").select(isMobile ? "b + a" : "li:has(b) + li a").text();

        let el = doc.select(".main .block-item li.item");

        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);

            let des = e.select(isMobile ? ".box-description-2" : ".box-description");

            data.push({
                name: des.select("a").first().text(),
                link: des.select("a").first().attr("href"),
                cover: e.select(isMobile ? ".box-cover-2 img" : ".box-cover img").first().attr("data-src"),
                host: "https://hentaivn.in"
            })
        }
        return Response.success(data, next)
    }
    return null;
}