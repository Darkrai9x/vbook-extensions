function execute(url) {
    url = url.replace("chivi.xyz", "chivi.app");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select("#L0").remove();
        let cvData = [];
        doc.select("cv-data")
            .forEach(e => cvData.push(e.text()));
        let htm = cvData.join("<br>");
        return Response.success(htm);
    }
    return null;
}