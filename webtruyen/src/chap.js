function execute(url) {
    url = url.replace("webtruyen.com", "dtruyen.com");
    var doc = Http.get(url).html();
    var title = doc.select(".chapter-title").first().text();
    doc.select("#chapter-content script,a,.text-webtruyen").remove();
    var isVip = doc.select("#chapter-content").attr("data-vip") == '1';
    if (isVip) {
        return Response.error("Bạn cần đăng nhập để đọc chương này");
    }
    return Response.success(doc.select("#chapter-content").html(), title);
}