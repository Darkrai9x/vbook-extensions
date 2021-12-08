
function execute() {
    const doc = Http.get("https://wikidth.net/").html();
    const el = doc.select("div.tag-tabs .tag-tab a");
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
           title: e.text(),
           input: 'https://wikidth.net' + e.attr('href'),
           script: 'gen.js'
        });
    }
    return Response.success(data);
}