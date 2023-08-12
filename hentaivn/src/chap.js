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
        let data = [];
        doc.select("#image img").forEach(e => {
            data.push(e.attr("data-src"));
        });
        return Response.success(data);
    }

    return null;

}