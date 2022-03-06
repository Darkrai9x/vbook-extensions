function execute(url) {
    let bookId = /-(\d+).html/.exec(url)[1];

    let response = fetch("https://webapi.gongzicp.com/novel/chapterGetList?nid=" + bookId);

    if (response.ok) {
        let data = response.json();
        if (data.code === 200) {
            let chapList = [];
            data.data.list.forEach(item => {
                if (item.type === 'item') {
                    chapList.push({
                        name: item.name,
                        url: "https://www.gongzicp.com/read-" + item.id + ".html",
                        pay: item.pay,
                        lock: item.lock
                    })
                }
            });
            return Response.success(chapList);
        }
    }

    return null;
}