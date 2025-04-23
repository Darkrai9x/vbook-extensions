load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        if (doc.select("title").text().includes("Đăng nhập để đọc truyện")) {
            return Response.error("Bạn cần đăng nhập hoặc tạo tài khoản mới để tiếp tục đọc truyện.");
        }
        let encryptedContent = doc.select("#encrypted-content").text();
        if (encryptedContent) {
            response = fetch(BASE_URL + "/reader/api/decrypt-content.php", {
                method: "POST",
                body: JSON.stringify({
                    "encryptedData": encryptedContent
                })
            });

            let json = response.json();

            return Response.success(json.content);
        }
        return Response.success(response.html().select("#noi-dung").html());
    }
    return null;
}