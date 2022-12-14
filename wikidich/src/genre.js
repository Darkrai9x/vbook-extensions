function execute() {
    let response = fetch("https://wikisach.net/");

    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("div.tag-tabs .tag-tab a").forEach(e => {
            data.push({
                title: e.text(),
                input: 'https://wikisach.net' + e.attr('href'),
                script: 'gen.js'
            });
        });
        return Response.success(data);
    }

    return null;
}