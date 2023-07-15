load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let list = [];
        let truyenId = doc.select("input#truyen-id").attr("value");
        let truyenAscii = doc.select("input#truyen-ascii").attr("value");
        let page = doc.select("input#total-page").attr("value");
        if (page) page = parseInt(page); else page = 1;
        for (let i = 1; i <= page; i++) {
            list.push(BASE_URL + "/ajax.php?type=list_chapter&tid=" + truyenId + "&tascii=" + truyenAscii + "&page=" + i + "&totalp=" + page);
        }
        return Response.success(list);
    }

    return null;
}