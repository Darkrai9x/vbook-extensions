function execute(url) {
    var doc = Http.get(url).html();
    var list = [];
    var truyenId = doc.select("input#truyen-id").attr("value");
    var truyenAscii = doc.select("input#truyen-ascii").attr("value");
    var page = doc.select("input#total-page").attr("value");
    if (page) page = parseInt(page); else page = 1;
    for (var i = 1; i <= page; i++) {
        list.push("https://truyenfull.vn/ajax.php?type=list_chapter&tid=" + truyenId + "&tascii=" + truyenAscii + "&page=" + i + "&totalp=" + page);
    }
    return Response.success(list);
}