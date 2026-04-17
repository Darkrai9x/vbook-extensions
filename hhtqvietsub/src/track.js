load('config.js');

function execute(url) {
    url = normalizeUrl(url);
    return Response.success({
        data: url,
        type: "auto",
        headers: {},
        host: BASE_URL,
        timeSkip: []
    });
}
