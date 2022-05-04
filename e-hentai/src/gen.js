function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select(".itg.gltc tr");
        let data = [];
        for (let i = 1; i < el.length; i++) {
            let e = el.get(i);
            var cover = e.select(".glthumb img").attr("data-src");
            if (!cover.startsWith("http")) cover = e.select(".glthumb img").attr("src");
            data.push({
                name: e.select(".glink").first().text(),
                link: e.select(".gl3c.glname a").first().attr("href"),
                cover: cover,
                description: e.select(".gl4c.glhide").first().text(),
                host: "https://e-hentai.org"
            })
        }
        return Response.success(data);
    }
    return null;
}