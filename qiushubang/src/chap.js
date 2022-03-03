function execute(url) {
    url = url.replace("m.qiushubang.me", "www.qiushubang.me");

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html('gbk');
        return Response.success(doc.select(".articleCon").html().replace(/&nbsp;/g, ""));
    }
    return null;
}