load('config.js');

function getEpisodeTitle(doc, episodeTitle) {
    let movieTitle = doc.select(".movie_name").text().trim();
    episodeTitle = (episodeTitle || "").trim();
    if (movieTitle && episodeTitle) {
        return movieTitle + " - " + episodeTitle;
    }
    return episodeTitle || movieTitle || "";
}

function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let active = doc.select(".halim-btn.active").first();
        if (!active) {
            active = doc.select(".halim-btn").first();
        }
        if (!active) {
            return Response.error("Không tìm thấy thông tin episode");
        }

        let tracks = [];
        let subServers = doc.select(".play-listsv");

        if (subServers.size() === 0) {
            subServers = doc.select("#halim-ajax-list-server span");
        }

        subServers.forEach(item => {
            let trackTitle = item.text().trim();
            tracks.push({
                title: trackTitle,
                data: url,
            });
        });

        if (tracks.length === 0) {
            tracks.push({
                title: "",
                data: url,
            });
        }

        return Response.success(tracks);
    }
    return null;
}
