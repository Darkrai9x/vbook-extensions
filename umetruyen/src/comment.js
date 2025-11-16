load('config.js');
function execute(input) {
    let doc = Html.parse(input);
    let comments = [];
    doc.select(".box-content").forEach(e => {
        comments.push({
            name: e.select("strong").text(),
            content: e.select(".comment-content").text(),
        });
    });
    return Response.success(comments);


}