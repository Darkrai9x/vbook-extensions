function execute(url) {
    url = url.replace("wikidich.com", "wikidth.com");
    url = url.replace("wikidth.com", "wikidth.net");
    url = url.replace("wikidth.org", "wikidth.net");
    url = url.replace("wikidth.net", "wikisach.com");
    url = url.replace("wikisach.com", "wikisach.info");
    url = url.replace("wikisach.info", "wikisach.net");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var reviewUrl = doc.select(".book-info-bottom > a:nth-child(3)").attr("href") +"";
        if (reviewUrl.includes("review/truyen")){
            var review = getReview(reviewUrl)
        } 
        let name = doc.select(".cover-info h2").text();
        let author = doc.select(".cover-info").html().match(/tac-gia.*?>(.*?)</);
        if (author) author = author[1];
       
        let element = doc.select("div.cover-info").first();
        element.select("h2,span,i").remove();
        return Response.success({
            name: name,
            cover: doc.select("div.book-info img").first().attr("src"),
            author: author,
            description: doc.select("div.book-desc-detail").html() +"<br>🔶🔶🔶🔶🔶<br> REVIEW <br>🔶🔶🔶🔶🔶<br>" +review,
            detail: element.html(),
            host: "https://wikisach.net",
            ongoing: doc.select(".cover-info").html().indexOf("Còn tiếp") > 0
        });
    }
    return null;
}
function getReview (reviewUrl){
        var reviewAll ="";
        let doc = Http.get("https://wikisach.net" + reviewUrl).html();
             var el = doc.select(".comment-content-msg")
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i).text();
            reviewAll = reviewAll + e + "<br>/////////////////<br>"
        }           
            return reviewAll
}