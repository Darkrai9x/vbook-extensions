function execute(url) {

    let bookId = getBookId(url);
    if (!bookId) return null;

    let chapId = /\/(\d+).html/.exec(url)[1];

    let ssid = 555;
    let hou = '.html';
    let xid = Math.floor(bookId / 1000)

    let urlData = 'https://www.dizishu.com/files/article/html' + ssid + '/' + xid + '/' + bookId + '/' + chapId + hou;

    let response = fetch(urlData);
    if (response.ok) {
        let data = response.text();
        let txt = Script.execute(data + "\nfunction getTxt() {return cctxt;}", "getTxt", "");
        return Response.success(txt);
    }

    return null;
}

function getBookId(url) {
    let response = fetch(url);

    if (response.ok) {
        let html = response.text();
        return parseInt(/bookid=(\d+);/.exec(html)[1]);
    }
    return null;
}