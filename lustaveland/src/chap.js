function execute(url) {
    url = url.replace("lustaveland.com", "luvevaland.co");
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        if (url.indexOf("truyen-tranh") > 0) {
            let imgs = [];
            doc.select("#chapter-content img").forEach(e => {
                var imgUrl = e.attr("src");
                if (!imgUrl.startsWith("http")) {
                    imgUrl = "https://luvevaland.co" + imgUrl;
                }
                imgs.push(imgUrl);
            });
            return Response.success(imgs);
        } else {
            return Response.success(doc.select("#chapter-content").html().replace(/&nbsp;/g, "")
            .replace(/Bản chuyển ngữ bạn đang đọc thuộc về .*? Nếu bạn đọc ở trang khác chứng tỏ đó là trang copy không có sự đồng ý của lustaveland. Bản copy sẽ không đầy đủ. Mong bạn hãy đọc ở trang chính chủ để đọc được bản đầy đủ nhất cũng như ủng hộ nhóm dịch có động lực hoàn nhiều bộ hơn nhé./g, ""));
        }
    }
    return null;
}