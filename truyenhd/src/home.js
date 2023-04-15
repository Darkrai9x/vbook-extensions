load('config.js');
function execute() {
    return Response.success([
        {title: "Truyện dịch", script: "hot.js", input: BASE_URL + "/truyen-dich DICHEDIT new-chap"},
        {title: "Truyện sáng tác", script: "hot.js", input: BASE_URL + "/truyen-sang-tac SANGTAC new-chap"}
    ])
}