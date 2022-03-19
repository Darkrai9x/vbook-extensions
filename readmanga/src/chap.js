function execute(url) {
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        doc.select("center").remove();
        doc.select("strong").remove();
        doc.select(".display-hide").remove();
        doc.select(".hidden").remove();
        let imgs = [];
        doc.select(".chapter-detail-novel-big-image img").forEach(e => {
            imgs.push(e.attr("src"));
        })
        return Response.success(imgs);
    }
}