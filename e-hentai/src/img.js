function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        if (url.indexOf("nl=") === -1) {
            let txt = response.text();
            var nl = /return nl\('(.*?)'\)/.exec(txt);
            if (nl) nl = nl[1];
            else nl = "";
            response = fetch(url + "?nl=" + nl);
        }
        let doc = response.html();
       
        return doc.select("#img").attr("src");
    }
    return null;
}