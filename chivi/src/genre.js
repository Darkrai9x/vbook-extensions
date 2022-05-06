function execute() {

    let response = fetch("https://chivi.app/");
    if (response.ok) {
        let doc = response.html();
        let menu = doc.select("genre-list a")
        var nav = []
        menu.forEach(e => {
            Console.log(e.select('a').attr("href"))
            let input = "https://chivi.app/api/books?genre=" + e.select('a').attr("href").replace("/books/-","")
            nav.push({ 
                title: e.text(), 
                input: input, 
                script: "gen.js" 
                })
        })
        return Response.success(nav)
    }

    return null;
}