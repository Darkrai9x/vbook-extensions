load('config.js');
load("crypto.js");
function execute(input, next) {
    if (!next) next = "1"
    let path = "/comment?book_id=" + input + "&page=" + next + "&sort=0&count=10";
    console.log(path)

    let response = fetch(BASE_URL + path, {
        headers: createHeaders(path)
    });
    if (response.ok) {
        let json = response.json();
        let data = json.data;
        let comments = [];
        data.comments.forEach(e => {
            let message = e.message;
            if (e.chapter && e.chapter.name_vi) {
                message = e.chapter.name_vi + "<br>" + message;
            }
            comments.push({
                name: e.user.fullname,
                content: message,
                description: e.created_at
            });
        });
        let lastPage = data.last_page;
        let currentPage = parseInt(next);
        if (currentPage < lastPage) {
            return Response.success(comments, Math.trunc(currentPage + 1) + "");
        } else {
            return Response.success(comments, null);
        }
    }

    return null;
}