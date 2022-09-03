function execute(key, page) {
    if (!page) page = '1';
    let response = fetch('https://sangtacviet.pro/?find=&findinname=' + key + '&minc=0&tag=&p=' + page);

    function toCapitalize(sentence) {
        const words = sentence.split(" ");

        return words.map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        }).join(" ");
    }

    if (response.ok) {
        let doc = response.html()
        let next = doc.select(".pagination").select("li.active + li").text()
        let el = doc.select("#searchviewdiv a.booksearch")
        let data = [];
        el.forEach(e => {
            data.push({
                name: toCapitalize(e.select(".searchbooktitle").first().text()),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(" div > span.searchtag").last().text(),
                host: "https://sangtacviet.pro"
            })
        });
        return Response.success(data, next)
    }
    return null;
}