function execute(url) {
    var data = [];
    data.push(url.replace( "/truyen/", "/chuong/"))
    return Response.success(data)
}