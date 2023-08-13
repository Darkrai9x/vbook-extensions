load('config.js');
function execute(input, next) {
    if (!next) next = "1"
    let response = fetch(input);
    if (response.ok) {
        let json = response.json();
        let data = json.data;
        let comments = [];
        data.comments.forEach(e => {
            let message = e.message;
            comments.push({
                name: e.user.fullname,
                content: message,
            });
        });

        return Response.success(comments, null);
    }

    return null;
}