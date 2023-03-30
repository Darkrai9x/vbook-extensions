load('config.js');
function execute(key, page) {
    if (!page) page = '0';

    let response = fetch(BASE_URL + '/find-book', {
        method: 'GET',
        queries : {
            title: key,
            page: page
        }
    });

    if (response.ok) {
        let doc = response.html();
        let el = doc.select(".view-content a");
        let novelList = [];
        let next = doc.select(".pager li.pager-current + li").last().select("a").text();
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            novelList.push({
                name: e.text(),
                link: e.attr("href"),
                host: BASE_URL
            });
        }

        return Response.success(novelList, next);
    }
    return null;
}
