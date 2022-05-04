function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var cover = /\((http.*?)\)/.exec(doc.select("#gd1").html());
        if (cover) cover = cover[1];
        else cover = "";
        return Response.success({
            name: doc.select("#gn").first().text(),
            cover: cover,
            author: doc.select("#gdn").first().text(),
            description: doc.select("#gdd").html(),
            detail: doc.select("#gj").html() + doc.select("#taglist").html(),
            host: "https://e-hentai.org",
            ongoing: false,
            nsfw: true
        });
    }
    return null;
}