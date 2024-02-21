load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL) + "/ajax/chapters/";

    let response = fetch(url, {
        method: "POST"
    });
    if (response.ok) {
        let doc = response.html();

        let el = doc.select(".page-content-listing a")
        const data = [];
        for (let i = el.size() - 1; i >= 0; i--) {
            let e = el.get(i);
            data.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        }

        return Response.success(data);
    }

    return null;
}