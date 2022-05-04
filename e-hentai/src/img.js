function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return doc.select("#img").attr("src");
    }
    return null;
}