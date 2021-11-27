function execute(url) {
    let storyUrl = url.split(" ");
    let response = fetch(storyUrl[1]);

    if (response.ok) {
        let data = response.json();
        let chapList = data.chaps.map(e => ({
            "name": e.title,
            "url": storyUrl[0] + "/-" + data.sname + "/-" + e.uslug + "-" + e.chidx,
            "host": "https://chivi.app"
        }));
        return Response.success(chapList);
    }

    return null;
}