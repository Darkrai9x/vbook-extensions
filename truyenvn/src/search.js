load('config.js');
function execute(key, page) {
    let response = fetch(BASE_URL + "/wp-admin/admin-ajax.php", {
        method: "POST",
        body: {
            title : key,
            action : "wp-manga-search-manga"
        }
    });
    if (response.ok) {
        let comiclist = [];
        response.json().data.forEach(item => {
            comiclist.push({
                name: item.title,
                link: item.url,
            });
        });
        return Response.success(comiclist);
    }
    return null;
}