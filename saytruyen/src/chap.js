function execute(url) {
    url = url.replace("saytruyen.net", "saytruyen.tv");
    url = url.replace("saytruyen.tv", "saytruyenvip.com");

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