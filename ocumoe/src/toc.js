load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select(".comic-intro table a");
        let name = doc.select(".info-title").text();
        let data = [];
        for (let i = el.size() - 1; i >= 0; i--) {
            let e = el.get(i);
            data.push({
                name: e.select("span").first().text().replace(name + ' – ', ''),
                url: e.attr("href"),
                host: BASE_URL
            });
        }

        return Response.success(data);
    }

    return null;

}