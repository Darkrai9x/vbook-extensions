function execute(url) {
    var doc = Http.get(url).html();
    var list = [];
    var lastPage = doc.select(".trangcurrent").text().match(/\d+\/(\d+)/);
    if (lastPage) lastPage = lastPage[1];
    else lastPage = '1';

    var totalPage = parseInt(lastPage);
    for (var i = 1;i <= totalPage; i++){
        list.push(url + "/page" + i);
    }
    return Response.success(list);
}
