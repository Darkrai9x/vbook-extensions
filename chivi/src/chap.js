function execute(url) {
    url = url.replace("chivi.xyz", "chivi.app");
    var doc = Http.get(url).html();
    doc.select("h1").remove();
    return Response.success(doc.select("article .mtl._p").outerHtml().replace(/<!--.*?-->/g, ''));
}