function execute(url) {
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        doc.select("center").remove();
        doc.select("strong").remove();
        doc.select(".display-hide").remove();
        doc.select(".hidden").remove();
        return Response.success(doc.select("#chapterText").html().replace(/&nbsp;/g, ""));
    }
}