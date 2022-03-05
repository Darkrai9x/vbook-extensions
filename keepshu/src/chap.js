function execute(url) {
    url = url.replace("m.keepshu.com", "www.keepshu.com");

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html('gbk');
        return Response.success(doc.select(".article-con").html().replace(/&nbsp;/g, ""));
    }
    return null;
}