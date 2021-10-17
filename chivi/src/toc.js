function execute(url) {
    var storyUrl = url.split(" ");
    var data = Http.get(storyUrl[1]).string();

    if (data) {
        const chapList = [];
        var json = JSON.parse(data);
        json.chaps.forEach(e => {
            chapList.push({
                "name": e.title,
                "url": storyUrl[0] + "/-" + json.sname + "/-" + e.uslug + "-" + e.chidx,
                "host": "https://chivi.app"

            });
        })
        return Response.success(chapList);
    }

    return null;
}