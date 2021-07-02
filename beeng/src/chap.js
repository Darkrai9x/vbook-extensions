function execute(url) {
    url = url.replace("beeng.net", "beeng.org");
    var doc = Http.get(url).html();
    var el = doc.select("#lightgallery2 img");
    
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push(e.attr("src"));
        
    }
    return Response.success(data);
}