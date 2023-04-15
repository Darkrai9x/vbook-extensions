load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc.select(".title-chap").remove();
        let htm = doc.select(".reading").html();
        if (htm.length < 100) {
            let password = doc.select("#password").attr("value");
            let postId = doc.select("#data").attr("data-id");
            if (password) {
                htm = fetch(BASE_URL + "/wp-admin/admin-ajax.php", {
                    method: 'POST',
                    body: {
                        'action': "user_pass_chap",
                        'post_id': postId,
                        'password': password
                    }
                }).text()
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