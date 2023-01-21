function execute(url) {
    let storyUrl = url.split(" ");
    let response = fetch(storyUrl[1]);
    if (response.ok) {
        let data = response.json();
        console.log(JSON.stringify(data))
        var sname = storyUrl[2];
        let chapList = []
        data.chaps.forEach(e => {
            parts = e.parts
            if(parts > 0) parts = parts -1;
            chapList.push({
                "name": e.title,
                "url": "https://chivi.app/_db/chaps/" + storyUrl[0] + "/" + sname + "/" + e.chidx + "/" + parts,
                "host": "https://chivi.app"
            });
        });

        return Response.success(chapList);
    }

    return null;
}