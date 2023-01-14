load('host.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, HOST);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success({
            name: doc.select("h1#truyen-title").text(),
            cover: doc.select("div#anhbia img").attr("src"),
            host: "https://bachngocsach.com",
            author: doc.select("div#tacgia a").text(),
            description: doc.select("div#gioithieu").html(),
            detail: doc.select("div#tacgia").html() + "<br>" + doc.select("div#theloai").html()
        });
    }
    return null;
}