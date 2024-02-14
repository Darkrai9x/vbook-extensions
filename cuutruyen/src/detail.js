load('config.js');
function execute(url) {

    let chapterId = /mangas\/(\d+)\/?/.exec(url)[1];

    let response = fetch(BASE_URL + "/api/v2/mangas/" + chapterId);

    if (response.ok) {
        let json = response.json();
        let data = json.data;

        return Response.success({
            name: data.name,
            cover: data.cover_url,
            author: data.author.name,
            description: data.description,
            detail: data.author.name + "<br>" + data.chapters_count + " Chương"
        });
    }

    return null;
}