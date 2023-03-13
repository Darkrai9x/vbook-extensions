load('config.js');
function execute(key, page) {
    if (!page) page = '1';

    let response = fetch(BASE_URL + "/tim-truyen", {
        method: "GET",
        queries: {"keyword": key, "page": page}
    });

    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pagination").select("li.active + li").text();

        let data = [];
        doc.select(".items .item").forEach(e => {
            let coverImg = e.select(".image img").first().attr("data-original");
            if (coverImg.startsWith("//")) {
                coverImg = "https:" + coverImg;
            }
            data.push({
                name: e.select("h3 a").first().text(),
                link: e.select("h3 a").first().attr("href"),
                cover: coverImg,
                description: e.select(".chapter a").first().text(),
                host: BASE_URL
            });
        });

        return Response.success(data, next);
    }

    return null;
}