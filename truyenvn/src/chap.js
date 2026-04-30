load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var browser = Engine.newBrowser(); // Khởi tạo browser
    var doc = browser.launch(url, 5000);
    browser.close();
    let imgs = [];
    doc.select("noscript").remove();
    doc.select(".reading-content img[id^=image]").forEach(e => {
        let url = e.attr("data-src").trim();
        if (!url) {
            url = e.attr("data-lazy-src").trim();
        }
        if (!url) {
            url = e.attr("src").trim();
        }
        imgs.push(url);
    });
    if (imgs.length === 0) {return Response.error("vào trang nguồn để check cloudflare");}
    return Response.success(imgs);

}