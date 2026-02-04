function execute(url) {
    // Sử dụng fetch thay vì Http.get để đồng bộ với môi trường hiện đại
    const response = fetch(url);
    if (!response.ok) return null;
    const doc = response.html();

    const genres = [];
    // 1. Lấy danh sách thể loại
    doc.select("#tags a.tag").forEach(e => {
        let name = e.select(".name").text();
        if (name) {
            genres.push({
                title: name,
                input: "https://nhentai.net" + e.attr("href"),
                script: "gen.js"
            });
        }
    });

    // 2. Làm đẹp phần Description (Tóm tắt tags)
    let tagSummary = "";
    doc.select(".tag-container").forEach(container => {
        let fullText = container.text();
        if (fullText.includes(":")) {
            let label = fullText.split(":")[0].trim();
            let tags = [];
            container.select(".tag .name").forEach(t => {
                tags.push(t.text());
            });

            if (tags.length > 0 && label !== "Pages") {
                tagSummary += "✨ <b>" + label + "</b>: " + tags.join(", ") + "<br>";
            }
        }
    });

    // 3. Làm đẹp phần Detail (Thông số kỹ thuật)
    let id = doc.select("#gallery_id").text().replace("#", "").trim();
    // Nếu không lấy được ID từ DOM, ta lấy từ URL (dành cho một số trường hợp đặc biệt)
    if (!id) id = url.split('/').filter(Boolean).pop();

    let pages = doc.select(".tag-container:contains(Pages) .name").text() || "0";
    let uploaded = doc.select("time").first().text() || "Không rõ";
    let authorName = doc.select(".tag-container:contains(Artists) a.tag .name").first().text() || "Unknown";

    let detailText = "🆔 <b>Mã số:</b> " + id + "<br>" +
        "📄 <b>Quy mô:</b> " + pages + " trang<br>" +
        "📅 <b>Đã đăng:</b> " + uploaded + "<br>" +
        "👤 <b>Tác giả:</b> " + authorName;

    const title = doc.select(".title .pretty").first().text() || doc.select("h1").text();

    return Response.success({
        name: title,
        cover: "https:" + doc.select("#cover img").first().attr("data-src"),
        author: authorName,
        description: tagSummary,
        detail: detailText,
        host: "https://nhentai.net",
        genres: genres,
        ongoing: title.toLowerCase().includes("ongoing"),
        nsfw: true,
        comment: {
            input: "https://nhentai.net/api/gallery/" + id + "/comments",
            script: "comment.js"
        }
    });
}