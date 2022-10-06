function execute(url) {
    url = url.replace("m.blogtruyen.vn", "blogtruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var imgs = [];
        doc.select("#content > img").forEach(e => {
            let url = e.attr("src");
            if (!url.contains("donate.png") && !url.contains("creblogtruyen.jpg")) {
                imgs.push(url);
            }
        });
        return Response.success(imgs);
    }
    return null;
}