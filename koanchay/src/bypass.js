function bypass(url, cookie) {
    fetch(url, {
        headers: {
            "Cookie": "wkdth_code=lamondungtuyentruyen",
            "user-agent": UserAgent.system()
        }
    });
}