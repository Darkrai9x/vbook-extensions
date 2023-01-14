load('host.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, HOST);

    let response = fetch(url);
    if (response.ok)
        return Response.success(response.html().select("#noi-dung").html());
    return null;
}