function execute(url) {
    url = url.replace("truyenvn.com", "truyenvn.tv");
    var doc = Http.get(url).html();
    var postId = doc.select("form input[name=p]").first().attr("value")
    var json = Http.post("https://truyenvn.tv/wp-admin/admin-ajax.php").params({
        action:  "z_do_ajax",
        _action:  "load_imgs_for_chapter",
        p: postId
    }).string();
    var data = JSON.parse(json);
    var imgs  = data.mes.map(item => {
        return item.url.replace("sv5.webtruyen.info","sv5.ghienmanga.net");
    });
    return Response.success(imgs);
}