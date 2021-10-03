function execute(url) {
    var doc = Http.get(url).html();
    var el = doc.select(".pictures img");
    
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var img = e.attr("src");
        if (img) {
            if (img.startsWith("//")) {
                img = "https:" + img;
            }
            if (img.startsWith("/")) {
                img = "https://umetruyen.net" + img;
            }

            if (!img.startsWith("http")) {
                img = "https://umetruyen.net/" + img;
            }
            data.push(img);
        }
    }
    return Response.success(data);
}