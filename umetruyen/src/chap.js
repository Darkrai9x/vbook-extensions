function execute(url) {
    url = url.replace("umetruyen.net", "umetruyen.org")
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        doc.select("#chapter_content img").forEach(e => {
            let img = e.attr("src").trim();
            if (img) {
                if (img.startsWith("//")) {
                    img = "https:" + img;
                }
                if (img.startsWith("/")) {
                    img = "https://umetruyen.org" + img;
                }

                if (!img.startsWith("http")) {
                    img = "https://umetruyen.org/" + img;
                }
                data.push(img);
            }
        });
        return Response.success(data);
    }

    return null;
}