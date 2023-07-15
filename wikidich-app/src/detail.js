load("config.js");
load("crypto.js");

function execute(url) {
    let path = url.replace(BASE_URL, "");
    let response = fetch(BASE_URL + path, {
        headers: createHeaders(path)
    });
    if (response.ok) {
        let json = response.json();
        if (json.code == -100) {
            return Response.error("Truyện đã bị ẩn.");
        }
        let data = json.data;
        let genres = [];
        let tags = data.attr_tag;
        if (tags) {
            tags.forEach(e => {
                genres.push({
                    title: e.name,
                    input: e.id
                });
            });
        }
        let comment = null;
        if (data.stats.comment_total > 0) {
            comment = {
                input: path.replace("/book/", ""),
                script: "comment.js"
            }
        }
        return Response.success({
            name: data.title_vi,
            cover: data.cover,
            author: data.author_cv,
            description: data.desc_vi.replace(/\r\n/g, "<br>"),
            detail: "Tên gốc: " + data.title_cn + "<br>Hán việt: " + data.title_cv + "<br>Số chương: " + data.total_chapter,
            ongoing: data.attr_status.name !== "Hoàn thành",
            nsfw: data.is_tag_h,
            genres: genres,
            suggests: [
                {
                    title: "Cùng thể loại",
                    input: path + "/similar?",
                    script: "rank.js"
                }
            ],
            comment: comment
        });
    }
}