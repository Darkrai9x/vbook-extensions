load('config.js');

function cleanHtml(htm) {
    var text = htm
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<a[^>]*>.*?<\/a>/gi, '')
        .replace(/<\/?(?:div|span)[^>]*>/gi, '')
        .replace(/&(?:nbsp|amp|quot|lt|gt);/g, '')
        .replace(/(<br>\s*){2,}/g, '<br>')
        .replace(/^(?:<br>\s*)+|(?:<br>\s*)+$/g, '')
        .replace(/[\\]/g, '')
        .replace(/[\u201c\u201d"]/g, '"')
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .replace(/ch\*t/gi, 'chết')
        .replace(/gi\*t/gi, 'giết')
        .replace(/s\*t/gi, 'sát')
        .replace(/v\*n/gi, 'vẫn')
        .replace(/th\*/gi, 'thi')
        .replace(/t\s*\*\s*nh\s*d\s*\*\s*c/gi, 'tình dục')
        .replace(/\*m\s*đ\**/gi, 'âm đạo')
        .replace(/\//g, '')
        .replace(/ƣ/g, 'ư')
        .trim();
    // Gom chữ bị chấm ngắt trong cùng từ, không xóa dấu câu giữa câu
    for (var i = 0; i < 3; i++) {
        text = text.replace(/([a-zà-ỹ])\s*\.\s*([a-zà-ỹ])/g, '$1$2');
    }
    text = text.replace(/([a-zà-ỹ])\s*\/\s*([a-zà-ỹ])/g, '$1$2');
    return text;
}

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let genres = [];

        // tác giả
        let author = doc.select("a[itemprop=author]");
        genres.push({
            title: author.text(),
            input: author.attr("href"),
            script: "gen.js"
        });

        // thể loại
        doc.select(".info a[itemprop=genre]").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        // gợi ý cùng tác giả
        let suggests = [];
        suggests.push({
            title: "Cùng tác giả",
            input: author.attr('href'),
            script: "gen.js"
        });

        // mô tả, đã làm sạch HTML
        let rawDesc = doc.select("div.desc-text").html();
        let cleanedDesc = cleanHtml(rawDesc);

        return Response.success({
            name: doc.select("h3.title").text(),
            cover: doc.select("div.book img").attr("src"),
            author: doc.select("div.info div a").first().text(),
            description: cleanedDesc,
            detail: "",
            ongoing: doc.select("div.info").html().indexOf(">Đang ra<") > 0,
            genres: genres,
            suggests: suggests,
            host: BASE_URL
        });
    }
    return null;
}
