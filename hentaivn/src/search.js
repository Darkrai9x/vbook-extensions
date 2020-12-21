function execute(key, page) {
    if (!page) page = '1';
    const http = Http.get("https://hentaivn.net/tim-kiem-truyen.html");
    const doc = http.params({"key": key, "page": page}).html();

    var cookies = http.cookie();

    var isMobile = false;

    if (cookies) {
        isMobile = cookies.indexOf("mobile=1") > 0;
    }

    var next = doc.select(".pagination").select(isMobile ? "b + a" : "li:has(b) + li a").text();

    const el = doc.select(".main .block-item li.item");

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);

        var des = e.select(isMobile ? ".box-description-2" : ".box-description");

        data.push({
            name: des.select("a").first().text(),
            link: des.select("a").first().attr("href"),
            cover: e.select(isMobile ? ".box-cover-2 img" : ".box-cover img").first().attr("data-src"),
            host: "https://hentaivn.net"
        })
    }
    return Response.success(data, next)
}