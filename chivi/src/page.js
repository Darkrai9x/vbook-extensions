function execute(url) {
    url = url.replace("chivi.xyz", "chivi.app");
    let response = fetch(url + "/chaps");

    if (response.ok) {
        let doc = response.html();
        let story = doc.html().match(/api\/chaps\/(\d+\/[a-z_]+)/)[1];
        let lastPage = doc.html().match(/pgmax.*?:(\d+)/);
 
        if (lastPage) {
            lastPage = parseInt(lastPage[1]);
        } else {
            lastPage = 1;
        }
        const pageList = [];
        for (let i = 1; i <= lastPage; i++) {
            pageList.push(url + " https://chivi.app/api/chaps/" + story + "?pg=" + i);
        }

        return Response.success(pageList);
    }

    return null;
}