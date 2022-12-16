load('config.js')
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL)
    let browser = Engine.newBrowser();
    browser.launch(url, 5000);
    doc = browser.html();
    browser.close();
    return Response.success({
        name: doc.select("h1.name").first().text(),
        cover: doc.select(".book img").first().attr("src"),
        author: doc.select(".author a").first().text(),
        description: doc.select(".comic-description").html(),
        detail: doc.select(".meta-data").html(),
        host: BASE_URL,
        ongoing: doc.select(".status").text().indexOf("Đang Cập Nhật") >= 0
    });

}