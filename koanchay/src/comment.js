load('config.js');
function execute(input, next) {
    if (!next) next = "0"
    let response = fetch(input, {
        headers: {"user-agent": UserAgent.system()},
        queries: {
            start: (parseInt(next) * 10) + ""
        }
    });
    if (response.ok) {
        let json = response.json();
        let data = json.data;
        let comments = [];
        let currentPage = data.current_page;
        let endPage = data.end_page;
        data.comments.forEach(e => {
            let message = e.message;
            comments.push({
                name: e.user.fullname,
                content: message,
            });
        });

        if (currentPage < endPage) {
            return Response.success(comments, (currentPage + 1) + "");
        }

        return Response.success(comments, null);
    }

    return null;
}