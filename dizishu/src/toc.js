load('config.js');
function execute(url) {

    let bookId = parseInt(/b\/(\d+)\/?$/.exec(url)[1]);
    let xid = Math.floor(bookId / 1000)
    let dataUrl = BASE_URL + '/files/' + xid + '/' + bookId + '/' + bookId + '.json';

    let response = fetch(dataUrl);
    if (response.ok) {
        let json = response.json();

        let chapters = [];

        json.list.forEach(item => {
            chapters.push({
                name: item.chaptername,
                url: BASE_URL + '/b/' + bookId + '/' + item.chapterid + '.html',
            })
        });

        return Response.success(chapters);
    }

    return null;
}