function execute(url) {
    var doc = Http.get(url).html();
    var el = doc.select("div#thumbnail-container div.thumb-container a");
    el.select("noscript").remove();
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
       
        data.push(e.select("img").attr("data-src").replace(/t(\d+?).nhentai.net/g, "i$1.nhentai.net").replace(/(\d+)t/, "$1"));
        
    }
    return Response.success(data);
}