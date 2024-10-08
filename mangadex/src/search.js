load("config.js");

function execute(key, page) {
    if (!page) page = 0;
    let response = fetch(API_URL + "/manga?title=" + key + "&limit=20&offset=" + page + "&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includes[]=cover_art&order[relevance]=desc");

    if (response.ok) {
        let data = response.json();
        let books = [];
        let next = "";
        if (data.offset + data.limit < data.total) {
            next = data.offset + data.limit;
        }
        data.data.forEach(item => {
            let bookId = item.id;
            let relationships = item.relationships;
            let cover = relationships.find(item => item.type === "cover_art");
            if (cover) {
                cover = BASE_URL + "/covers/" + bookId + "/" + cover.attributes.fileName + ".256.jpg";
            }
            books.push({
                name: getDisplayLanguageData(item.attributes.title),
                link: BASE_URL + "/title/" + bookId,
                cover: cover,
                host: BASE_URL
            });
        });

        return Response.success(books, next + "");
    }

    return null;

}