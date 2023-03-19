function execute() {

    let response = fetch("https://shubl.com/index/book_list");
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select('[name=type] a').forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr('href').slice(0, -2),
                script: "gen.js"
            });
        });

        return Response.success(genres);
    }

    return null;
}