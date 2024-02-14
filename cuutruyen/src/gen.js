load('config.js');
function execute(url, page) {

    if (!page) page = '1';
    let response = fetch(url, {
        method: "GET",
        queries: {
            page: page,
            per_page: 24
        }
    });

    if (response.ok) {
        let json = response.json();

        let metadata = json._metadata;
        var next = '';
        if (metadata.current_page < metadata.total_pages) {
            next = metadata.current_page + 1;
        }
        let novels = [];
        json.data.forEach(item => {
            novels.push({
                name: item.name,
                link: BASE_URL + "/mangas/" + item.id,
                cover: item.cover_url,
                description: "C. " + item.newest_chapter_number
            })
        });

        return Response.success(novels, next);
    }

    return null;
}