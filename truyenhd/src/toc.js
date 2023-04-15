load('config.js');

function execute(url) {
    let list = [];
    let response = fetch(BASE_URL + "/wp-admin/admin-ajax.php", {
        method: 'POST',
        body: JSON.parse(url)
    });
    if (response.ok) {
        let doc = response.html();
        let el = doc.select('.listchap li');
        if (el.length > 0) {
            el.forEach(e => {
                list.push({
                    name: e.select('a').text(),
                    url: e.select('a').attr('href'),
                    pay: e.select("img").attr('alt') === 'vip',
                    host: BASE_URL
                });
            });
        } else {
            doc.select('a').forEach(e => {
                list.push({
                    name: e.text(),
                    url: e.attr('href'),
                    host: BASE_URL
                });
            });
        }

        if (list.length === 0) {
            let page = doc.select("#pagination").text().match(/1\/(\\d+)/);
            if (page) {
                page = parseInt(page);

                for (let i = 1; i <= page; i++) {
                    list.push({
                        name: "Phần " + i,
                        url: BASE_URL + url + "/" + i,
                        host: BASE_URL
                    });
                }
                return Response.success(list);
            }
        }


        return Response.success(list);
    }
    return null;
}