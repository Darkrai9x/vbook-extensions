load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let bookId = /title\/([a-f0-9\-]+)/g.exec(url)[1];
    let languages = LANGUAGE;
    let translatedLanguage = "";
    let languageParts = languages.split(",");
    languageParts.forEach(languagePart => {
        translatedLanguage += "&translatedLanguage[]=" + languagePart;
    });

    let chapterGroups = {};
    let offset = 0;
    while (true) {
        let data = loadChapterPart(API_URL + "/manga/" + bookId + "/feed?&includes[]=scanlation_group&includes[]=user&order[volume]=asc&order[chapter]=asc", offset, translatedLanguage);
        data.data.forEach((item) => {
            let group = chapterGroups[item.language];
            if (!group) group = [];
            let title = item.title;
            if (title) {
                title = "Ch. " + item.chapter + " - " + item.title;
            } else {
                title = "Ch. " + item.chapter;
            }
            group.push({
                name: title,
                url: BASE_URL + "/chapter/" + item.id,
            });
            chapterGroups[item.language] = group;
        });
        if (!data.next) break
        offset = data.next;
    }
    return Response.success(getDisplayLanguageData(chapterGroups))
}

function loadChapterPart(url, offset, translatedLanguage) {
    let response = fetch(url + "&offset=" + offset + "&limit=96" + translatedLanguage);
    if (response.ok) {
        let data = response.json();
        let chapters = [];
        data.data.forEach(item => {
            if (item.type === "chapter") {
                let attributes = item.attributes;
                chapters.push({
                    "id": item.id,
                    "title": attributes.title,
                    "chapter": attributes.chapter,
                    "language": attributes.translatedLanguage
                });
            }
        });
        let next = 0;
        if (data.offset + data.limit < data.total) {
            next = data.offset + data.limit;
        }
        return {
            "next": next,
            "data": chapters,
        };
    }
}