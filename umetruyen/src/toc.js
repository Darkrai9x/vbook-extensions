function execute(url) {
    let response = fetch(url);
    if (response.ok) {

        const doc = response.html();

        let el = doc.select(".box-list-chapter a");
        let data = [];
        for (let i = el.length - 1; i >= 0; i--) {
            let e = el[i];
            data.push({
                name: e.text(),
                url: e.attr("href"),
                host: "https://umetruyen.net"
            })
        }
        return Response.success(data);
    }

    return null;
}