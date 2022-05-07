function execute(url) {
    let id = /hentai-img.com\/(image|story)\/([a-z0-9-]+)\/?/.exec(url);

    if (id) id = id[2];
    let newUrl = "https://hentai-img.com/image/" + id + "/";
    let response = fetch(newUrl);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("#title").first().text(),
            cover: doc.select("#post img").first().attr("src"),
            author: "",
            description: doc.select("#detail_tag").html(),
            host: "https://hentaivn.moe",
            nsfw: true,
            url: newUrl
        });
    }
    return null;
}