function execute() {
    return Response.success([
        {
            "title": "Mới nhất",
            "script": "gen.js",
            "input": "https://wikidth.com/bang-xep-hang?so=4"
        },
        {
            "title": "Rating",
            "script": "gen.js",
            "input": "https://wikidth.com/bang-xep-hang?tr=1&so=2"
        }
    ]);
}