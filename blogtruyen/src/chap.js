function execute(url) {
    url = url.replace("m.blogtruyen.vn", "blogtruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var imgs = doc.select("article#content img").map(e => e.attr("src"));
        return Response.success(imgs);
    }
    return null;
}