load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL)
    let response = fetch(url, {
        headers: {
            "referer": BASE_URL
        }
    });
    if (response.ok) {
        let doc = response.html();
        let isMobile = doc.select(".header-logo").size() !== 0;
        let data = [];
        if (isMobile) {
            let getUrl = doc.html().match(/(list-showchapter-mobile.php.*?)\"/)[1];

            doc = fetch(BASE_URL + "/" + getUrl).html();
            let el = doc.select(".episodes a")
            for (let i = el.size() - 1; i >= 0; i--) {
                let e = el.get(i);
                data.push({
                    name: e.text(),
                    url: e.attr("href"),
                    host: BASE_URL
                })
            }
        } else {
            let getUrl = doc.html().match(/(list-showchapter.php.*?)\"/)[1];

            doc = fetch(BASE_URL + "/" + getUrl).html();
            let el = doc.select("a")
            for (let i = el.size() - 1; i >= 0; i--) {
                let e = el.get(i);
                data.push({
                    name: e.text(),
                    url: e.attr("href"),
                    host: BASE_URL
                })
            }
        }

        return Response.success(data);
    }

    return null;
}