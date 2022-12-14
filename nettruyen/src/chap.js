function execute(url) {
    url = url.replace("nettruyen.com", "nettruyenmoi.com");
    url = url.replace("nettruyentop.com", "nettruyenmoi.com");
    url = url.replace("nettruyenvip.com", "nettruyenmoi.com");
    url = url.replace("nettruyenpro.com", "nettruyenmoi.com");
    url = url.replace("nettruyengo.com", "nettruyenmoi.com");
    url = url.replace("nettruyenmoi.com", "nettruyenone.com");
    url = url.replace("nettruyenone.com", "nettruyenco.com");
    url = url.replace("nettruyenco.com", "nettruyenme.com");
    url = url.replace("nettruyenme.com", "nettruyenin.com");
    url = url.replace("nettruyenin.com", "nettruyenon.com");
    url = url.replace("nettruyenon.com", "nettruyentv.com");
    url = url.replace("nettruyentv.com", "nettruyenmin.com");
    url = url.replace("nettruyenmin.com", "nettruyenking.com");

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        doc.select(".page-chapter img").forEach(e => {
            let img = e.attr("data-original");
            if (!img) {
                img = e.attr("src");
            }
            if (img) {
                if (img.startsWith("//")) {
                    img = "http:" + img;
                }
                data.push(img);
            }
        });
        return Response.success(data);
    }
    return null;
}