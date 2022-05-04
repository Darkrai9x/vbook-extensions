function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        doc.select("#gdt a").forEach(e => {
            data.push({
                link: e.attr("href"),
                script: "img.js"
            })
        })
        return Response.success(data);
    }
    return null;
}