load('config.js');
function execute(input, next) {
    let response = fetch(input);
    if (response.ok) {
        let doc = response.html();
        let comments = [];
        doc.select("#commentList > .review-group").forEach(e => {
            comments.push({
                name: e.select(".comment-content").first().select(".comment-username").text(),
                content:  e.select(".comment-content").first().select(".comment-content-msg").text(),
            });
        });

        return Response.success(comments, null);
    }

    return null;
}