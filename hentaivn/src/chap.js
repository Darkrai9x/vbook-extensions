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

        let isMobile = doc.select(".header-logo").size() !== 0;
        let data = [];
        if (isMobile) {
            doc.select("noscript").remove();
            let el = doc.select("#image img");

            for (let i = 0; i < el.size(); i++) {
                let e = el.get(i);
                let img = e.attr("data-cfsrc");
                if (!img) {
                    img = e.attr("src")
                }
                data.push(img);

            }
        } else {
            let el = doc.select("#image img");
            for (let i = 0; i < el.size(); i++) {
                let e = el.get(i);
                data.push(e.attr("src"));
            }
        }
        return Response.success(data);
    }

    return null;

}