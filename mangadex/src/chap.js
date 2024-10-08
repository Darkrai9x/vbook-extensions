load("config.js");

function execute(url) {
    let chapterId = /chapter\/(.*?)$/g.exec(url)[1];
    let response = fetch(API_URL + "/at-home/server/" + chapterId + "?forcePort443=false");

    if (response.ok) {
        let data = response.json();
        let images = [];
        data.chapter.data.forEach((chapter) => {
            images.push(data.baseUrl + "/data/" + data.chapter.hash + "/" + chapter)
        });
        return Response.success(images);
    }

    return null;
}