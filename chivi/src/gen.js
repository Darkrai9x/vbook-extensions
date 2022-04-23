function execute(url, page) {
    if (!page) page = "1";
    page = parseInt(page)

    let response = fetch(url + "&pg=" + page + "&lm=24");
    if (response.ok) {

        let data = response.json().props;
        let next = "";

        let novelList = [];

        if (data.books) {
            let total = data.total;
            if (page < total) {
                next = page + 1;
            }
            
            novelList = data.books.map(item => {

                return {
                    "name": item.vname,
                    "link": "-" + item.bslug,
                    "description": item.vauthor,
                    "cover": item.bcover ? "/covers/" + item.bcover : "",
                    "host": "https://chivi.app"
                }
            });
            return Response.success(novelList, next);
        }
    }

    return null;
}