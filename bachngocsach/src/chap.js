load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
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