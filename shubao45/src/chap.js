function execute(url) {
    let part = /(\d+_\d+\/\d+).html/.exec(url)[1];
    let root = /^(http.*?\/)\d+_\d+\/\d+/.exec(url)[1];
    var next = part;
    var data = "";
    while (next.includes(part)) {
        let response = fetch(root + next + ".html");
        if (response.ok) {
            let doc = response.html('gbk');
            next = doc.select("a#pb_next").last().attr("href");
            if (next) {
                next = /(\d+_\d+\/\d+_\d+).html/.exec(next);
                if (next) {
                    next = next[1];
                } else {
                    next = "";
                }
            }
            data += doc.select("#nr1").html().replace(/&nbsp;/g, "");
        } else {
            return null;
        }
    }
    return Response.success(data);
}