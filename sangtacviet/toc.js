function execute(url) {
    var doc = Http.get(url + "/").html();

    var newUrl = doc.html().match(/(index\.php\?ajax=getchapterlist.*?)\'/)
    var list = [];
    if (newUrl) {

        var json = Http.get("http://sangtacviet.com/" + newUrl[1].replace(/&amp;/g, "&")).string();
        var data = JSON.parse(json);

        var source = url.match(/\/truyen\/([a-z]+)\//)
        if (source) source = source[1];


        var chapList = data["data"];
        if (chapList) {
            chapList = chapList.split("-//-")
            var start = (source == "uukanshu") ? chapList.length - 1 : 0;
            var end = (source == "uukanshu") ? -1 : chapList.length;
            var step = (source == "uukanshu") ? -1 : 1;

            for (; start != end; start += step) {
                var chap = chapList[start].split("-/-");

                var name = chap[2];
                if (name) {
                    list.push({
                        name: name,
                        url: url + "/" + chap[1],
                        host: "http://sangtacviet.com"
                    });
                }
            }
        }

    }

    return Response.success(list);
}