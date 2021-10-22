function execute(url) {
    var doc = Http.get(url).html();
    var el =doc.select(".row .item_ch");
    const data = [];
    for (var i = 0; i < el.size();i++ ) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.select('a' ).attr("href"),
            host: "https://nhasachmienphi.com"
        })
    }

    return Response.success(data); 
}