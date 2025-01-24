load("config.js");

function execute(url) {
    let response = fetch(BASE_URL.replace("https://", "https://api.") + url);
    if (response.ok) {
        let json = response.json();
        let chapters = [];
        json.data.forEach(e => {
            chapters.push({
                name: e.name,
                url: e.url,
                pay: e.is_vip,
                host: BASE_URL,
            });
        });
        return Response.success(chapters);
    }
    return null;

}