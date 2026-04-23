load('config.js');

function execute(url) {
    if (url.indexOf(".mp4") !== -1 || url.indexOf(".m3u8") !== -1) {
        return Response.success({
            data: url,
            type: "native",
            headers: {
                "User-Agent": UserAgent.chrome(),
                "Referer": BASE_URL
            },
            host: BASE_URL,
            timeSkip: []
        });
    }
    else {
        return Response.success({
            data: url,
            type: "auto",
            headers: {},
            host: BASE_URL,
            timeSkip: []
        });
    }
}
