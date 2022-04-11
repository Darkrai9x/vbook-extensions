function execute(url) {
    let storyUrl = url.split(" ");
    let response = fetch(storyUrl[1]);

    if (response.ok) {
        let data = response.json();
        var sname = data.props.chseed.sname;
        let chapList = data.props.chpage.chaps.map(e => ({
            "name": e.title,
            "url": storyUrl[0] + "/chaps/" + sname + "/" + e.uslug + "-" + e.chidx,
            "host": "https://chivi.app"
        }));
        return Response.success(chapList);
    }

    return null;
}