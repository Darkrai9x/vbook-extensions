load('config.js');

function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let list = [];
        let servers = doc.select(".halim-server");
        let hasMultipleServers = servers.size() > 1;

        servers.forEach(server => {
            let serverName = server.select(".halim-server-name").text();
            let eps = server.select(".halim-list-eps li");
            if (hasMultipleServers && serverName) {
                list.push({
                    name: serverName,
                    type: "section"
                });
            }

            for (let i = eps.size() - 1; i >= 0; i--) {
                let e = eps.get(i);
                let a = e.select("a").first();
                let span = e.select("span").first();
                let href = a.attr("href") || span.attr("data-href");
                let name = span.text() || a.text();
                list.push({
                    name: name,
                    url: href,
                    host: BASE_URL
                });
            }
        });

        return Response.success(list);
    }
    return null;
}
