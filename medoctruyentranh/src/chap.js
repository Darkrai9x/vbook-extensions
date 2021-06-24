function execute(url) {
    var htm = Http.get(url).string();
    if(htm) {
        var data = htm.match(/<script.*?type=\"application\/json\">(.*?)<\/script>/)
        if (data) data = JSON.parse(data[1]);
        var imgsList = [];
        data.props.pageProps.initialState.read.detail_item.elements.forEach(v => {
            imgsList.push(v.content);
        });
        return Response.success(imgsList);
    }

    return null;
}