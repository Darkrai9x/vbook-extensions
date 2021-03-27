function execute(url) {
    var htm = "";
    if (url.indexOf("sj.uukanshu.com") !== -1) {
        var doc = Http.get(url).html();
        doc.select(".ad_content").remove();
        doc.select("div.box").remove();
        htm = doc.select("#bookContent").html();
    } else {
        var doc = Http.get(url).html("gb2312");
        doc.select(".ad_content").remove();
        htm = doc.select("#contentbox").html();
    }
    htm = htm.replace(/[UＵ][UＵ]\s*看书\s*[wｗ][wｗ][wｗ][\.．][uｕ][uｕ][kｋ][aａ][nｎ][sｓ][hｈ][uｕ][\.．][cｃ][oｏ][mｍ]/gi, "");
    htm = htm.replace(/\&nbsp;/g, "");
    return Response.success(htm);
}