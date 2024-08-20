load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    let response = fetch(BASE_URL + "/tim-truyen/search.php", {
        method: "GET",
        queries: {
            keysearch: key,
            page: page
        }
    });

    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = doc.select(".phantrangactive + a").first().text();
        doc.select(".tabtruyen tr").forEach(e => {
            e.select(".fullicon").remove();
            novelList.push({
                name: e.select(".tabtruyen-name").text(),
                link: e.select("a").first().attr("href"),
                description: e.select("[itemprop=author]").text(),
                cover: e.select(".tabtruyen-img").attr("src"),
                host: BASE_URL,
            });
        });
        return Response.success(novelList, next);
    }
    return null;
}