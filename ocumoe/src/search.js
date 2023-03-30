load('config.js');

function execute(key, page) {

    let response = fetch(BASE_URL + '/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: {"action": "searchtax", "keyword": key}
    });
    if (response.ok) {
        const jsonData = response.json();

        const data = jsonData.data.map(e => {
            return {
                name: e.title,
                link: e.link,
                cover: e.img,
                description: e.cstatus,
                host: BASE_URL
            }
        });

        return Response.success(data)
    }
    return null;
}