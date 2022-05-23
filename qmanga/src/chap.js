function execute(url) {
    url = url.replace("qmanga.net", "qmanga.co");
    url = url.replace("qmanga.co", "qmanga2.net");
    url = url.replace("qmanga2.net", "qmanga3.com");
    var doc = Http.get(url).html();
    var el = doc.select("#aniimated-thumbnial img");
    
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var img = e.attr("src");
        if (img) {
            if (img.startsWith("//")) {
                img = "https:" + img;
            }
            data.push(img);
        }
    }
    return Response.success(data);
}