function execute(url, page) {
    let response = fetch("https://www.biqubu.com" + url);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#newscontent .l li").forEach(e => {
            let link = e.select(".s2 a").first().attr("href");
            let regex = /book_(\d+)/g;
            let bookId = regex.exec(link);
            let cover = "";
            if (bookId) {
                var id = bookId[1];
                cover = "https://www.biqubu.com/files/article/image/" + Math.floor(id / 1000) + "/" + id + "/" + id + "s.jpg"
            }

            data.push({
                name: e.select(".s2 a").first().text(),
                link: e.select(".s2 a").first().attr("href"),
                cover: cover,
                description: e.select(".s3 a").first().text(),
                host: "https://www.biqubu.com"
            })
        });

        return Response.success(data)
    }
    return null;
}