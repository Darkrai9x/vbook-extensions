load('config.js');
function execute(key, page) {
    if (!page) page = '1';

    let response = fetch(BASE_URL + "/api/book-search", {
        method: 'POST',
        body: {
            keyword: key,
        }
    });

    if (response.ok) {
        let json = response.json();
        let novelList = [];
        json.data.forEach(e => {
            novelList.push({
                name: e.name,
                link: e.slug,
                description: e.author,
                cover: e.coverUrl,
                host: BASE_URL,
            });
        });
        return Response.success(novelList);
    }
    return null;
}
