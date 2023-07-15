load('config.js');

function execute(input, next) {

    let doc = Html.parse(input);
    let comments = [];
    doc.select(".post-wrap").forEach(e => {
        comments.push({
            name: e.select(".post-auther b").text(),
            content: e.select(".post-body").text(),
            description: ""
        });
    });
    return Response.success(comments);
}