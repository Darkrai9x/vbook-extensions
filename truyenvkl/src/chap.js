function execute(url) {
    url = url.replace("truyenvkl.com", "s2.truyenhd.com");
    url = url.replace("s2.truyenhd.com", "s3.truyenhd.com");
    url = url.replace("s3.truyenhd.com", "truyenhd1.com");
    url = url.replace("truyenhd1.com", "truyenhdz.com");
    var doc = Http.get(url).html();
    if (doc) {
        doc.select(".title-chap").remove();
        var htm = doc.select(".reading").html();
        if (htm.length < 100) {
            var password = doc.select("#password").attr("value");
            var postId = doc.select("#data").attr("data-id");
            if (password) {
                htm = Http.post("https://truyenhdz.com/wp-admin/admin-ajax.php")
                    .params({
                        'action': "user_pass_chap",
                        'post_id': postId,
                        'password': password
                    }).string()
                    .replace(/<[a-z]+>[a-z]+<\/[a-z]+>/g, '')
                    .replace(/<style>[a-z]+{font-size: 0px}<\/style>/g, '')
                    .replace(/<span style=\"color:#FFFFFF;font-size:6px\">[a-z]<\/span>/g, '')
                    .replace(/<[a-z]+>(.*?)<\/[a-z]+>/g, '$1');
            }
        }
        return Response.success(htm);
    }
    return null;
}