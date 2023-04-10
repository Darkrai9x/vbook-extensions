load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {

        let imgs = [];
        response.html().select("#chapter_content img").forEach(e => {
            imgs.push(e.attr("src"));
        });
        return Response.success(imgs);
    }

    return null;
}