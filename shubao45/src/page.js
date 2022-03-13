function execute(url) {
    let response = fetch(url + "/");

    if (response.ok) {
        let doc = response.html('gbk');
        let pages = [];

        doc.select("select[name=pageselect] option").forEach(e => {
            pages.push("http://m.shubao45.com" + e.attr('value'));
        });

        return Response.success(pages);
    }
    return null;
}