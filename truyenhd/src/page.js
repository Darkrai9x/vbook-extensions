load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {

        let doc = response.html();
        let list = [];
        let pages = doc.select(".pagination li");
        let page = 1
        let listChap = doc.select("#dsc");
        let dataId = doc.select("#views").attr("data-id");
        let dataSlug = doc.select("#views").attr("data-slug");
        if (listChap.length) {
            if (pages.length > 1) {
                page = pages.get(pages.length - 2).text().match(/(\d+)/);
                if (page) page = parseInt(page[1]); else page = 1;
            }
            for (let i = 1; i <= page; i++) {
                list.push(JSON.stringify({
                    'action' : 'user_truyen_pagination',
                    'page': i,
                    'type': '',
                    'id': dataId,
                    'slug': dataSlug
                }));
            }

        } else {
            list.push(
                JSON.stringify({
                    'action' : 'all_chap',
                    'id': dataId
                })
            );
        }

        return Response.success(list);
    }
    return null;
}