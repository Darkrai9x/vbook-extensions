load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let page = doc.select(".pagination > li a[href~=page]").last().text();
        let pageList = [];
        if (page) {
            let totalPage = parseInt(page);
            for (let i = 1; i <= totalPage; i++) {
                pageList.push(url + "?page=" + i);
            }
        } else {
            pageList.push(url + "?page=1");
        }
        return Response.success(pageList);
    }
    return null;
}