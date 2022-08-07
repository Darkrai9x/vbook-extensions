function execute(url) {
    url = url.replace("lustaveland.com", "luvevaland.co");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let isLogin = doc.select(".header__login-group").length === 0;

        if (!isLogin) return Response.error("Bạn phải vào trang nguồn đăng nhập trước để đọc truyện.");

        let info = doc.select(".book__detail-container");
        info.select(".book__detail-name > div").remove();
        return Response.success({
            name: info.select(".book__detail-name").text(),
            cover: info.select("img").first().attr("src"),
            author: info.select(".book__detail-text a").first().text(),
            description: doc.select("#home").html(),
            detail: info.select(".book__detail-text").html(),
            ongoing: info.html().indexOf("Truyện Full") === -1,
            host: "https://luvevaland.co",
            type: doc.select(".breadcrumb__container").html().indexOf("truyen-tranh") > 0 ? "comic" : "novel"
        });
    }
    return null;
}