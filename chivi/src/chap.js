function execute(url) {
    if(url.slice(-1) === "/")
        url = url.slice(0, -1)
    url = url.replace("chivi.xyz", "chivi.app");
    let cvData = [];
    let part1 = url.replace("https://chivi.app", "");
    var next = part1;
    while (next.replace(next.split(/[/ ]+/).pop().split("-")[0],"").replace(/-/g,"").includes(part1.replace(part1.split(/[/ ]+/).pop().split("-")[0],"").replace(/-/g,""))) {
        let response = fetch("https://chivi.app" + next);
        if (response.ok) {
            let doc = response.html();
            console.log(doc)
            next = doc.select("a.m-btn._fill.navi-item._primary").last().attr("href");
            // console.log(next)
            // console.log(part1)
            try {
                doc.select("#L0").remove();
            }
            catch(err) {}
            doc.select("cv-line")
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