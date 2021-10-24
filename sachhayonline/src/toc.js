function execute(url) {
    var doc = Http.get(url).html();
    var el =doc.select("ul.default li");
    const data = [];
    for (var i = 0; i < el.size();i++ ) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: "/" + e.select('a' ).attr("href"),
            host: "https://sachhayonline.com/tua-sach"
        })
    }

    return Response.success(data); 
}
// ai-lam-duoc/gioi-thieu/593
//https://sachhayonline.com/tua-sach/ai-tinh-mieu/chuong-1/601