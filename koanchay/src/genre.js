load("config.js");

function execute() {
    let response = fetch(BASE_URL + '/bang-xep-hang', {
        headers: {
            "user-agent": UserAgent.system()
        },
    });
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("div.tag-tabs .tag-tab a").forEach(e => {
            data.push({
                title: e.text(),
                input: BASE_URL + e.attr('href'),
                script: 'gen.js'
            });
        });
        return Response.success(data);
    }

    return null;
}