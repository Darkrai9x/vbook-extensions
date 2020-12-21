function execute(url) {

    const data = [];
    data.push({
        name: "Oneshot",
        url: url
    })

    return Response.success(data);
}