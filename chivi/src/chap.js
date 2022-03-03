function execute(url) {
    url = url.replace("chivi.xyz", "chivi.app");
    let cvData = [];
    let part1 = url.replace("https://chivi.app", "");
    var next = part1;
    while (next.includes(part1)) {
        let response = fetch("https://chivi.app" + next);
        if (response.ok) {
            let doc = response.html();
            next = doc.select(".navi > a._primary").attr("href");
            doc.select("#L0").remove();

            doc.select("cv-data")
                .forEach(e => cvData.push(e.text()));
        } else {
            return null;
        }
    }
    if (cvData) {
        let htm = cvData.join("<br>");
        return Response.success(htm);
    }
    return null;
}