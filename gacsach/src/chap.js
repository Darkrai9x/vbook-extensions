load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if(response.ok) {
        let doc = response.html();
        let e = doc.select("div.field-item.even");
        e.select("p[style=text-align: center; line-height: 1.1;]").remove();
        return Response.success(e.html());
    }
    return null;
}