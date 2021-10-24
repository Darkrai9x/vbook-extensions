function execute(url) {
    var doc = Http.get(url + ".html").html();
    var content = doc.select(".reading-white").select("p").html();
    content = content.replace(/\n/g,'<br>')
    content = content.replace(/&nbsp;/g,'')
    return Response.success(content); 
}
