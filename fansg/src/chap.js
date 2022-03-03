function execute(url) {
    url = url.replace("www.fansg.com", "m.fansg.com");
    let part = /(\d+_\d+).html/.exec(url)[1];
    let root = /^(http.*?\/)\d+_\d+/.exec(url)[1];
    var next = part;
    var data = "";
    while (next.includes(part)) {
        let response = fetch(root + next + ".html");
        if (response.ok) {
            let doc = response.html();
            next = doc.select(".chapter-porn a").last().attr("href");
            if (next) {
                next = /(\d+_\d+_\d+).html/.exec(next);
                if (next) {
                    next = next[1];
                } else {
                    next = "";
                }
            }
            doc.select(".read-section .text-info").remove();
            doc.select(".read-section .member").remove();
            doc.select(".read-section h3").remove();
            data += doc.select(".read-section").html();
        } else {
            return null;
        }
    }
    return Response.success(data);
}