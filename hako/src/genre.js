function execute(url, page) {
    let response = fetch("https://ln.hako.vn/danh-sach");
    if (response.ok) {
        let doc = response.html();
        const data = [];
		doc.select("ul.filter-type.unstyled.clear li.filter-type_item a").forEach(e => {
            data.push({ 
                    title: e.select("a").text(), 
                    input: e.select("a").attr("href"),
                    script: "gen.js" 
                })
        });
        return Response.success(data);
    }
    return null;
}