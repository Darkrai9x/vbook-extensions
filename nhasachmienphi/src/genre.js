function execute() {
    const doc = Http.get('https://nhasachmienphi.com/tat-ca-sach').html();
    const el = doc.select('.item_folder_sidebar  a');
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
           title: e.select('a').text(),
           input: e.attr('href'),
           script: 'gen.js'
        });
    }
    return Response.success(data);
}