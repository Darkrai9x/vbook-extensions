function execute(url) {
    url = url.replace("truyenyy.com", "truyenyy.vip")
        .replace("truyenyy.vn", "truyenyy.vip");

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        let chapList = [];
        let isMobile = doc.select("meta[name=mobile-web-app-capable]").attr("content") === "yes";
        if (isMobile) {
            doc.select(".novel-detail > .weui-cells > a.weui-cell").forEach(e => {
                let name = "Chương " + e.select(".weui-cell__hd .small").text() + ": " + e.select(".weui-cell_primary").text();
                chapList.push({
                    name: name,
                    url: e.attr("href"),
                    pay: e.select("img[data-src~=vip]").length > 0,
                    host: "https://truyenyy.vip",
                });
            })
        } else {
            doc.select("tbody tr").forEach(e => {
                var ch = e.select("td").first().text();
                ch = ch + ". " + e.select("td").get(1).text();
                chapList.push({
                    name: ch,
                    url: e.select("a").first().attr("href"),
                    pay: e.select("img[data-src~=vip]").length > 0,
                    host: "https://truyenyy.vip",
                });
            });
        }
        return Response.success(chapList);
    }

    return null;
}