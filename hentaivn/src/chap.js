load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url, {
        headers: {
            "referer": BASE_URL
        }
    });

    if (response.ok) {
        let doc = response.html();

        let newUrl = BASE_URL +"/" + /(list-loadchapter.php.*?)"/.exec(doc.html())[1];
        response = fetch(newUrl, {
           method:"GET",
            headers: {
               "Referer": url
            }
        });
        if (response.ok) {
            doc = response.html();
            let data = [];
            doc.select("img").forEach(e => {
                data.push(e.attr("src"));
            });
            return Response.success(data);
        }
    }

    return null;

}