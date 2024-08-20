load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let list = [];
        let lastPage = doc.select(".trangcurrent").text().match(/\d+\/(\d+)/);
        if (lastPage) lastPage = lastPage[1];
        else lastPage = '1';

        let totalPage = parseInt(lastPage);
        for (let i = 1; i <= totalPage; i++) {
            list.push(url + "/page" + i);
        }
        return Response.success(list);
    }
    return null;
}
