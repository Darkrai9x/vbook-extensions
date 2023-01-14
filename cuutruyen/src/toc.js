function execute(url) {
    let mangaId = /mangas\/(\d+)\/?/.exec(url)[1];
    let response = fetch("https://kakarot.cuutruyen.net/api/v2/mangas/" + mangaId + "/chapters");

    if (response.ok) {
        let json = response.json();
        let data = json.data;

        let chapters = [];
        for (let i = data.length - 1; i >= 0; i--) {
            chapters.push({
                name: data[i].name ? ("C. " + data[i].number + ": " + data[i].name) : ("C. " + data[i].number),
                url: "https://cuutruyen.net/mangas/" + mangaId + "/chapters/" + data[i].id
            });
        }
        return Response.success(chapters);
    }

    return null;
}