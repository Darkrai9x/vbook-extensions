function execute(url) {
    var request = Http.get(url)
    var doc = request.html();
    var newUrl = request.url();

    if (doc) {
        if (newUrl.indexOf("metruyenchu.com") > 0
            || newUrl.indexOf("nuhiep.com") > 0
            || newUrl.indexOf("vtruyen.com") > 0) {
            return loadNewWeb(doc);
        }
        return loadOldWeb(newUrl, doc);
    }

    return null;
}

function loadNewWeb(doc) {

    var content = doc.select("#js-read__content").first();
    if (content.text().length < 2000) {
        return Response.error(url);
    }
    doc.select("script").remove();
    doc.select("div.nh-read__alert").remove();
    doc.select("small.text-muted").remove();
    doc.select(".text-center").remove();
    var html = content.html();
    var trash = /.*(<br>.*?<a href=.*?\/truyen\/.*?)$/g.exec(html);

    if (trash) {
        trash = trash[1];
        if (trash.length < 2000) {
            html = html.replace(trash, "");
        }
    }
    html = html.replace(/^Chương \d+.{1,100}<br>/g, "");
    return Response.success(html);
}

function loadOldWeb(url, doc) {
    var element = doc.select("div.content").first();
    if (element.text().length() < 2000) {
        return Response.error(url);
    }

    element.select("div").remove();
    element.select("script").remove();
    element.select("font").remove();
    element.select("center").remove();
    element.select("button").remove();
    element.select("a").remove();
    if (element.select("p").size() < 20)
        element.select("p").remove();

    var title = doc.select("div.header h2.title").first().text();

    return Response.success(element.html(), title);
}