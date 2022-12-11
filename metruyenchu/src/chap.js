function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img,"https://metruyencv.com")
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        var content = doc.select("#article").first();
        if (content.text().length < 2000) {
            return Response.error(url);
        }
        doc.select("script").remove();
        doc.select("div.nh-read__alert").remove();
        doc.select("small.text-muted").remove();
        doc.select(".text-center").remove();
        var html = content.html();
        var trash = html.match(new RegExp(/====================.*?<a href=.*?\/truyen\/.*?$/g));
        if (trash) {
            trash = trash[trash.length - 1];
            console.log(trash)
            if (trash.length < 2000) {
                html = html.replace(trash, "");
            }
        }
        return Response.success(html);
    }
    return null;
}