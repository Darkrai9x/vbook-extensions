function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = Html.parse(response.text().replace(new RegExp('\r?\n','g'), "<br />"));
        if (doc) {
            return Response.success(doc.select("div.box-chap").first().html());
        }
    }
    return null;
}