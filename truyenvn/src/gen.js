load('config.js');

function execute(url, page) {
    if (!page) page = 1;
    let response = fetch(url + "/page/" + page);
    // var browser = Engine.newBrowser(); // Khởi tạo browser
    // var doc = browser.launch(url + "/page/" + page, 5000);
    // browser.close();
    if (response.ok) {
        let doc = response.html();
        let comiclist = [];
        let next = parseInt(page + 1);
        console.log(next);
        doc.select(".page-listing-item .badge-pos-1").forEach(e => {
            let cover = e.select(".c-image-hover img").first().attr("srcset").split(",").pop().trim().split(" ")[0]
            || "https://i.postimg.cc/T2WtdmBM/5BdXa90.webp";
            comiclist.push({
                name: e.select(".post-title .h5 a").text(),
                link: e.select(".post-title .h5 a").attr("href"),
                cover: cover,
                description: e.select('.chapter-item').first().text(),
                host: BASE_URL
            });
        });
        return Response.success(comiclist, next);
    }
    return Response.error("vào trang nguồn để check cloudflare");
}