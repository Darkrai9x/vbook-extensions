function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + '&p=' + page)
    if (response.ok) {
        let doc = response.html()
        let next = doc.select(".pagination").select("li.active + li").text()
        let el = doc.select("#searchviewdiv a.booksearch")
        let data = [];
        function toCapitalize(sentence) {
            const words = sentence.split(" ");

            return words.map((word) => {
                return word[0].toUpperCase() + word.substring(1);
            }).join(" ");
        }
        el.forEach(e => {
            let img = e.select("img").first().attr("src");
            if (img.startsWith('//')) img = img.replace('//', 'https://')
            data.push({
                name: toCapitalize(e.select(".searchbooktitle").first().text()),
                link: e.select("a").first().attr("href"),
                cover: img,
                description: e.select(".searchtag").first().text(),
                host: "https://sangtacviet.pro"
            })
        });
        return Response.success(data, next)
    }
    return null;
}