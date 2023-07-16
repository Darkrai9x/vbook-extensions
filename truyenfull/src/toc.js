load('config.js');
function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let json = response.json();
        let doc = Html.parse(json.chap_list);
        let list = [];
        doc.select(".list-chapter li a").forEach(e => {
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        });
        return Response.success(list);
    }
    return null;
}