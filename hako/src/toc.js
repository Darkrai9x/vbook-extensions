function execute(url) {
    var doc = Http.get(url).html();
    if (doc) {
        var list = [];
        var sections = doc.select(".volume-list");
        for (var i = 0; i < sections.size(); i++) {
            var section = sections.get(i);
            var sectionName = section.select(".sect-title").text();
            var chapters = section.select(".list-chapters li");

            for (var j = 0; j < chapters.size(); j++) {
                var chapter = chapters.get(j);
                var name = chapter.select(".chapter-name a").text()
                if (j === 0)
                    name = sectionName + " " + name;
                list.push({
                    name: name,
                    url: chapter.select(".chapter-name").select("a").first().attr("href"),
                    host: "https://ln.hako.re"
                });

            }
        }
        return Response.success(list)
    }
}