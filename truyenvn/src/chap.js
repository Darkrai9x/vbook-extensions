function execute(url) {
    var doc = Http.get(url).html();
    var postId = doc.select("form input[name=p]").first().attr("value")
    var json = Http.post("https://truyenvn.com/wp-admin/admin-ajax.php").params({
        action:  "z_do_ajax",
        _action:  "load_imgs_for_chapter",
        p: postId
    }).string();
    var data = JSON.parse(json);
    var imgs  = data.mes.map(item => {
        return item.url;
    });
    return Response.success(imgs);
}