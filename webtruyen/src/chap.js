function execute(url) {
    url = url.replace("webtruyen.com", "dtruyen.com");
    var doc = Http.get(url).html();
    doc.select("#chapter-content script,a,.text-webtruyen").remove();
    return Response.success(doc.select("#chapter-content").html());
}