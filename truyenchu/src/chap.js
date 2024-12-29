load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let content = doc.select("article");
        let txt = content.html().replace("<em>.*?Chương này có nội dung ảnh.*?</em>", "</?em>");
        return Response.success(txt);
    }
    return null;
}