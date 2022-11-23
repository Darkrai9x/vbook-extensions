function execute() {
    return Response.success([
        {
            "title": "Mới nhất",
            "script": "gen.js",
            "input": "https://wikisach.info/bang-xep-hang?so=4"
        },
        {
            "title": "Rating",
            "script": "gen.js",
            "input": "https://wikisach.info/bang-xep-hang?tr=1&so=2"
        }
    ]);
}