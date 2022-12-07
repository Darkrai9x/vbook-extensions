function execute(url) {
    url = url.replace("hentaivn.net", "hentaivn.tv");
    url = url.replace("hentaivn.tv", "hentaivn.moe");
    url = url.replace("hentaivn.moe", "hentaivn.fun");
    url = url.replace("hentaivn.fun", "hentaivn.la");
    url = url.replace("hentaivn.la", "hentaivn.in");
    let response = fetch(url, {
        headers: {
            "referer": "https://hentaivn.in"
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