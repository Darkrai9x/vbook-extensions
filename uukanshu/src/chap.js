load("config.js");
function execute(url) {
    let htm = "";
    if (url.indexOf("sj.") !== -1) {
        let doc = fetch(url).html();
        doc.select(".ad_content").remove();
        doc.select("div.box").remove();
        htm = doc.select("#bookContent").html();
    } else {
        let doc = fetch(url).html("gb2312");
        doc.select(".ad_content").remove();
        htm = doc.select("#contentbox").html();
    }
    htm = htm.replace(/[UＵ][UＵ]\s*看书\s*[wｗ][wｗ][wｗ][\.．][uｕ][uｕ][kｋ][aａ][nｎ][sｓ][hｈ][uｕ][\.．][cｃ][oｏ][mｍ]/gi, "");
    htm = htm.replace(/\&nbsp;/g, "");
    return Response.success(htm);
}