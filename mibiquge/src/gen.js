function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#newscontent .l li").forEach(e => {
            data.push({
                name: e.select(".s2 a").first().text(),
                link: e.select(".s2 a").first().attr("href"),
                description: e.select(".s3 a").first().text(),
                host: "https://www.mibiquge.com"
            })
        });

        return Response.success(data)
    }
    return null;
}