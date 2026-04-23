load('config.js');

function getEpisodeSlugAndServerId(url) {
    let match = (url || "").match(/\/([^\/?#]+)-sv(\d+)\.html(?:[?#].*)?$/i);
    if (match) {
        return {
            episode_slug: match[1],
            server_id: match[2],
        };
    }
    return {
        episode_slug: "",
        server_id: "",
    };
}

function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let tracks = [];

        let episodeInfo = getEpisodeSlugAndServerId(url);
        let episodeSlug = episodeInfo.episode_slug;
        let serverId = episodeInfo.server_id || "1";
        let postId = doc.select("div.last[data-id]").attr("data-id");
        let nonce = doc.select("body").attr("data-nonce");

        let playerUrl = BASE_URL + "/wp-content/themes/haunmovies/player.php?episode_slug=" + episodeSlug + "&server_id=" + serverId + "&subsv_id=&post_id=" + postId + "&nonce=" + nonce + "&custom_var=";
        // console.log("Player URL:" + playerUrl);
        let playerResponse = fetch(playerUrl, {
            headers: {
                "User-Agent": UserAgent.chrome(),
                "Referer": url,
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        if (playerResponse.ok) {
            let playerJson = playerResponse.json();
            let scriptContent = playerJson.data.sources;
            // console.log("Script Content:" + scriptContent);
            let videoUrl = "";

            if (scriptContent.includes('"file"')) {
                let fileMatch = scriptContent.match(/"file"\s*:\s*"(https?[:\\\/]+[^"]+)"/);
                if (fileMatch) {
                    videoUrl = fileMatch[1].replace(/\\/g, "");
                }
            } 

            else if (scriptContent.includes('<iframe')) {
                let iframeMatch = scriptContent.match(/src="([^"]+)"/);
                if (iframeMatch) {
                    let iframeSrc = iframeMatch[1].replace(/\\/g, "");
                    // console.log("Iframe Source:" + iframeSrc);

                    if (iframeSrc.includes("/embed/")) {
                        videoUrl = iframeSrc.split("?")[0].replace("/embed/", "/file/") + "/master.m3u8";
                    }

                    else if (iframeSrc.includes("/share/")) {
                        let videoResponse = fetch(iframeSrc);
                        if (videoResponse.ok) {
                            let videoText = videoResponse.text();
                            let urlMatch = videoText.match(/const\s+url\s*=\s*"([^"]+)"/);
                            if (urlMatch) {
                                videoUrl = iframeSrc.split('/').slice(0, 3).join('/') + urlMatch[1];
                            }
                        }
                    }
                }
            }

            if (videoUrl) {
                tracks.push({
                    title: "Mặc định",
                    data: videoUrl,
                });
            } else {
                tracks.push({
                    title: "Mặc định",
                    data: url,
                });
            }
        }

        return Response.success(tracks);
    }
    
    return null;
}
