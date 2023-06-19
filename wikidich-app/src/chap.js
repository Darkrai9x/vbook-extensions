load("config.js");
load("crypto.js");

function execute(url) {
    let content = "";
    let currentPage = 0;
    while (currentPage >= 0) {
        let part = loadPartText(url, currentPage);
        currentPage = part.next_part
        content += part.content
    }
    content = content.replace(/\n/g, "<br>");

    return Response.success(content);
}

function loadPartText(url, part) {
    let path = url.replace(BASE_URL, "") + "?part=" + part + "&trans_type=0&edit_name=0&index_page_count=100";
    let response = fetch(BASE_URL + path, {
        headers: createHeaders(path)
    });
    if (response.ok) {
        let json = response.json();
        let data = json.data;
        let totalPart = data.total_part;
        if (part < totalPart) {
            return {
                "next_part": part + 1,
                "content": data.content
            };
        } else {
            return {
                "next_part": -1,
                "content": data.content
            };
        }
    }
    return {
        "next_part": -1,
        "content": ""
    };
}