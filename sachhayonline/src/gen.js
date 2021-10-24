function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get(url).html()
     var el = doc.select("ul.default > li");
    const data = [];
     for (var i =0; i <el.size();i++){
     var e = el.get(i);
        data.push({    
        name: e.select("a").first().text(),
        link: e.select("a").first().attr("href").replace(/../,''),
        cover: null,
        description : null,
        host: "https://www.sachhayonline.com"
         })
    }
    return Response.success(data)
}
