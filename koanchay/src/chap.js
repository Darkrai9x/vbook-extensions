function execute(url) {
    url = url.replace("koanchay.com", "koanchay.net");
    return Response.success(Http.get(url).html().select("div#bookContentBody").html());
}