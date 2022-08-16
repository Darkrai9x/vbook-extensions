function execute(url) {
    url = url.replace("sstruyen.com", "sstruyen.vn");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select("iframe,ins").remove();
        return Response.success(doc.select("div.content.container1").html());
    }

    return null;
}