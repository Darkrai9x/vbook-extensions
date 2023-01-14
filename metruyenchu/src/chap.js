function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img,"https://metruyencv.com")
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        var content = doc.select("#article").first();
        if (content.text().length < 2000) {
            return Response.error("Chương bị mã hoá chống leak, chưa thể lấy được nội dung.");
        }

        content.select("script").remove();
        content.select("div.nh-read__alert").remove();
        content.select("small.text-muted").remove();
        content.select(".text-center").remove();
        var html = content.html().replace(/&nbsp;/g, " ");
        var trash = html.match(new RegExp(/====================.*?<a href=.*?\/truyen\/.*?$/g));
        if (trash) {
            trash = trash[trash.length - 1];
            if (trash.length < 2000) {
                html = html.replace(trash, "");
            }
        }
        return Response.success(html);
    }
    return null;
}