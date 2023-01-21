function execute() {

    let response = fetch("https://chivi.app/");
    if (response.ok) {
        let doc = response.html();
        let doc2 = doc.select("details.content ").get(3);
        let menu = doc2.select("div.choices span.radio-text")
        var nav = []
        menu.forEach(e => {
            if(e.text() !== "Tất cả" )
            {
                let input = "https://chivi.app/_db/books" + encodeURI("?genres=" + e.text());
                nav.push({ 
                    title: e.text(), 
                    input: input, 
                    script: "gen.js" 
                    })
            }
            
        })
        return Response.success(nav)
    }

    return null;
}