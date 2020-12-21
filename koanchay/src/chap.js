function execute(url) {
    return Response.success(Http.get(url).html().select("div#bookContentBody").html());
}