load('config.js');

function execute(input, next) {
    if (!next) next = "1"
    let response = fetch(BASE_URL + "/wp-admin/admin-ajax.php", {
        method: "POST",
        body: {
            "action": "z_do_ajax",
            "_action": "load_more_comments",
            "cat": input,
            "page": next,
            "ppp": 10
        }
    });
    if (response.ok) {
        let json = response.json();
        let doc = Html.parse(json.mes);
        let comments = [];
        doc.select("li").forEach(e => {
            comments.push({
                name: e.select(".mb-1 .mb-2 strong").text(),
                content: e.select(".content-comment").text(),
                description: e.select(".mb-1 .mb-2 span").last().text(),
            });
        });

        let next = json.page + "";

        return Response.success(comments, next);
    }

    return null;
}