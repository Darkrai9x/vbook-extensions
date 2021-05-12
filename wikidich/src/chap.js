function execute(url) {
    url = url.replace("wikidich.com", "wikidth.com");
    return Response.success(Http.get(url).html().select("div#bookContentBody").html());
}