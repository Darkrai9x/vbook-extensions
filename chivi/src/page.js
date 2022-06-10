function execute(url) {
    url = url.replace("chivi.xyz", "chivi.app");
    let response = fetch(url + "/chaps");

    if (response.ok) {
        let doc = response.html();
        let story = doc.html().split('<script type=\"application\/json\" sveltekit:data-type=\"data\" sveltekit:data-url=\"')[2].split('"')[0].split('?pg=')[0];

        // console.log(story)


        let lastPage = doc.html().match(/pgmax.*?:(\d+)/);
 
        if (lastPage) {
            lastPage = parseInt(lastPage[1]);
        } else {
            lastPage = 1;
        }
        const pageList = [];
        for (let i = 1; i <= lastPage; i++) {
            pageList.push(url + " https://chivi.app" + story + "?pg=" + i);
        }

        return Response.success(pageList);
    }

    return null;
}