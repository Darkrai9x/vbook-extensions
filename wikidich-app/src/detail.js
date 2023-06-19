load("config.js");
load("crypto.js");

function execute(url) {
    let path = url.replace(BASE_URL, "");
    let response = fetch(BASE_URL + path, {
        headers: createHeaders(path)
    });
    if (response.ok) {
        let json = response.json();
        let data = json.data;
        let tag = data.attr_tag.map(e => e.name).join(", ")
        return Response.success({
            name: data.title_vi,
            cover: data.cover,
            author: data.author_cv,
            description: "Thể loại: " + tag + "<br>" +data.desc_vi.replace(/\r\n/g, "<br>"),
            detail: "Tên gốc: " + data.title_cn + "<br>Hán việt: " + data.title_cv + "<br>Tác giả: " + data.author_cv,
            ongoing: data.attr_status.name !== "Hoàn thành",
            nsfw: data.is_tag_h
        });
    }
}