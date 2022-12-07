function execute(url) {
    url = url.replace("koanchay.net", "koanchay.com");
    url = url.replace("koanchay.com", "koanchay.info");
    return Response.success(Http.get(url).html().select("div#bookContentBody").html());
}