load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc;
        let nextPart = url;
        let content = '';
        do {
            console.log(nextPart)
            doc = fetch(nextPart).html();
            nextPart = BASE_URL + doc.select(".bottem1 a").last().attr("href");
            doc.select("#play").remove();
            doc.select(".report").remove();
            doc.select('p[style*=\"color:red;\"]').remove();
            doc.select('ins').remove();
            doc.select('script').remove();
            content += doc.select("#booktxt");
        } while (nextPart.indexOf("page=") !== -1)

        return Response.success(content);
    }
    return null;
}