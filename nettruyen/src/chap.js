load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        doc.select(".page-chapter img").forEach(e => {
            let img = e.attr("data-original");
            let dataCdn = e.attr('data-cdn')
            if (!img) {
                img = e.attr("src");
            }
            if (dataCdn) {
                if (dataCdn.startsWith("//")) {
                    dataCdn = "https:" + dataCdn;
                }
            }
            if (img) {
                if (img.startsWith("//")) {
                    img = "http:" + img;
                }
                data.push({
                    link: img,
                    fallback: [
                        dataCdn,
                        'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image/*&url=' + encodeURIComponent(img)
                    ]
                });
            }
        });
        return Response.success(data);
    }
    return null;
}