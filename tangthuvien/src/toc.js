load("config.js");
function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let id = doc.select("input[name=story_id]").attr("value");
        response = fetch(BASE_URL + "/story/chapters?story_id=" + id);
        if (response.ok) {
            doc = response.html();
            let list = [];
            doc.select("li a").forEach(e => {
                list.push({
                    name: e.text(),
                    url: e.attr("href"),
                    host: BASE_URL
                });
            });
            return Response.success(list);
        }
    }
    return null;
}