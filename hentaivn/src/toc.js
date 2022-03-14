function execute(url) {
    url = url.replace("hentaivn.net", "hentaivn.tv");
    url = url.replace("hentaivn.tv", "hentaivn.moe");
    let response = fetch(url, {
        headers: {
            "referer": "https://hentaivn.moe"
        }
    });
    if (response.ok) {
        let doc = response.html();
        let isMobile = doc.select(".header-logo").size() !== 0;
        let data = [];
        if (isMobile) {
            let getUrl = doc.html().match(/(list-showchapter-mobile.php.*?)\"/)[1];
            
            doc = fetch("https://hentaivn.moe/" + getUrl).html();
            let el = doc.select(".episodes a")
            for (let i = el.size() - 1; i >= 0; i--) {
                let e = el.get(i);
                data.push({
                    name: e.text(),
                    url: e.attr("href"),
                    host: "https://hentaivn.moe"
                })
            }
        } else {
           let getUrl = doc.html().match(/(list-showchapter.php.*?)\"/)[1];
            
            doc = fetch("https://hentaivn.moe/" + getUrl).html();
            let el = doc.select("a")
            for (let i = el.size() - 1; i >= 0; i--) {
                let e = el.get(i);
                data.push({
                    name: e.text(),
                    url: e.attr("href"),
                    host: "https://hentaivn.moe"
                })
            }
        }

        return Response.success(data);
    }

    return null;
}