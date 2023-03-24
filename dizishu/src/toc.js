function execute(url) {


    let bookId = parseInt(/b\/(\d+)\/?$/.exec(url)[1]);
    let xid = Math.floor(bookId / 1000)
    let dataUrl = 'https://www.dizishu.com/files/' + xid + '/' + bookId + '/' + bookId + '.json';

    let response = fetch(dataUrl);
    if (response.ok) {
        let json = response.json();

        let chapters = [];

        json.list.forEach(item => {
            chapters.push({
                name: item.chaptername,
                url: 'https://www.dizishu.com/b/' + bookId + '/' + item.chapterid + '.html',
            })
        });

        return Response.success(chapters);
    }

    return null;
}