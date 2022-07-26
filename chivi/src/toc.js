function execute(url) {
    let storyUrl = url.split(" ");
    let response = fetch(storyUrl[1]);
    if (response.ok) {
        let data = response.json();
        console.log(JSON.stringify(data))
        var sname = storyUrl[2];

        let chapList = data.chaps.map(e => ({
            "name": e.title,
            "url": "https://chivi.app/api/chaps/" + storyUrl[0] + "/" + sname + "/" + e.chidx + "?parts=" + e.parts,
            "host": "https://chivi.app"
        }));
        return Response.success(chapList);
    }

    return null;
}