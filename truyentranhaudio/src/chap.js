function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, "https://truyentranhaudio.org");   
    var doc = Http.get(url).html();
    var el = doc.select("#ctl00_divCenter > div > div > div.reading-detail.box_doc img");
    
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push(e.attr("data-original"));
    }
    return Response.success(data);
}