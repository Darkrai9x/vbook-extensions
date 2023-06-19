load("config.js");
load("crypto.js");

function execute(url) {
    let chapters = [];
    let hasMore = true;
    let currentPage = 1;
    while (hasMore) {
        let tocPage = loadTocPage(url, currentPage);
        hasMore = tocPage.has_more;
        tocPage.chapters.forEach(chapter => {
            chapters.push(chapter);
        });
        currentPage++;
    }

    return Response.success(chapters);
}

function loadTocPage(url, page) {
    let path = url.replace(BASE_URL, "") + "/chapter?page=" + page + "&count=100&sort=0";
    let response = fetch(BASE_URL + path, {
        headers: createHeaders(path)
    });

    if (response.ok) {
        let json = response.json();

        let data = json.data;
        let chapters = [];
        data.volumes.forEach(volume => {
            volume.chapters.forEach(chapter => {
                chapters.push({
                    name: chapter.name_vi,
                    url: BASE_URL + "/chapter/" + chapter.id,
                })
            })
        });

        return {
            "has_more": data.has_more,
            "chapters": chapters
        }
    }
    return {
        "has_more": false,
        "chapters": []
    }

}