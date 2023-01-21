function execute(url) {
    url = url.replace("chivi.xyz", "chivi.app");
    let response = fetch(url + "/chaps");

    if (response.ok) {
        let doc = response.html();
        let story = doc.html().split('<script type=\"application\/json\" data-sveltekit-fetched data-url=\"')[1].split('"')[0].split("/")
        let temp = story.pop()
        story= story.join("/")

        console.log(story)
        let book_id = doc.html().split('data-url="/_db/seeds/')[1].split('"')[0].split("/")[0];

        let sname = doc.select('script[type="application/json"]').last().attr("data-url").split("/")[4]


        // let sname = story.split(/[/ ]+/).pop();
        let lastPage = doc.html().match(/pgmax.*?:(\d+)/);
        if (lastPage) {
            lastPage = parseInt(lastPage[1]);
        } else {
            lastPage = 1;
        }
        const pageList = [];
        for (let i = 1; i <= lastPage; i++) {
            pageList.push(book_id + " https://chivi.app/_db/seeds/" + book_id + "/"  + sname +"/" + i +" " + sname);
        }
        return Response.success(pageList);
    }

    return null;
}