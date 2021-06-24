function bypass(url, doc) {
    var cookie = doc.html().match(/document.cookie="(.*?)"/);
    if (cookie) {
        cookie = cookie[1];
        doc = Http.get(url).headers({"Cookie": cookie}).html();
    }
    return doc
}