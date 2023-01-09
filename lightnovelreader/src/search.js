function execute(key, page) {
    load('config.js');
    let response = fetch(BASE_URL + "/search/autocomplete", {
        method: "GET",
        queries: {
            dataType: "json",
            query: key
        }
    });

    if (response.ok) {
        let json = response.json();
        const data = [];
        json.results.forEach(e => {
            data.push({
                name: e.original_title,
                link: e.link,
                cover: e.image,
                description: e.overview,
                host: BASE_URL
            })
        });

        return Response.success(data)
    }

    return null;
}