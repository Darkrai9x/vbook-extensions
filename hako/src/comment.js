load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let comments = [];

        doc.select("#series-comments .ln-comment-item").forEach(e => {
            let name = e.select(".ln-username").first().text();
            let content = e.select(".ln-comment-content").first().text();
            let time = e.select("time").first();

            comments.push({
                name: name,
                content: content,
                description: time ? time.attr("title") : ""
            });
        });

        let next = doc.select("#series-comments .paging_item.next").first();
        return Response.success(comments, next ? next.attr("href") : null);
    }

    return null;
}
