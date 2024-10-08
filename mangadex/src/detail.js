load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let bookId = /title\/([a-f0-9\-]+)/g.exec(url)[1];
    console.log(bookId)
    let response = fetch(API_URL + "/manga/" + bookId + "?includes[]=artist&includes[]=author&includes[]=cover_art");
    if (response.ok) {
        let data = response.json();
        let attributes = data.data.attributes;
        let relationships = data.data.relationships;

        let cover = relationships.find(item => item.type === "cover_art")
        if (cover) {
            cover = BASE_URL + "/covers/" + bookId + "/" + cover.attributes.fileName + ".512.jpg"
        }
        let author = relationships.find(item => item.type === "author");
        if (author) {
            author = author.attributes.name;
        }
        let genres = [];
        attributes.tags.forEach(e => {
            genres.push({
                title: getDisplayLanguageData(e.attributes.name),
                input: e.id,
                script: "gen.js"
            });
        });
        return Response.success({
            name: getDisplayLanguageData(attributes.title),
            cover: cover,
            author: author,
            description: getDisplayLanguageData(attributes.description),
            genres: genres,
            ongoing: attributes.status === "ongoing",
            nsfw: attributes.contentRating !== "safe",
        });
    }
}