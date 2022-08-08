function execute(url) {
    url = url.replace("qmanga.net", "qmanga.co");
    url = url.replace("qmanga.co", "qmanga2.net");
    url = url.replace("qmanga2.net", "qmanga3.com");
    url = url.replace("qmanga3.com", "qmanga3.net");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let data = [];
        doc.select("#aniimated-thumbnial img").forEach(e => {
            let img = e.attr("src");
            if (img) {
                if (img.startsWith("//")) {
                    img = "https:" + img;
                }
                data.push(img);
            }
        })
        return Response.success(data);
    }
    return null;
}