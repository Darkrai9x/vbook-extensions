function execute(url) {
    var doc = Http.get(url).html();

    if (doc) {
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
    return null;
}