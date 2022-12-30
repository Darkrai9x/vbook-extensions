function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img,"https://metruyencv.com")
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        var content = doc.select("#article").first();
        if (content.text().length < 2000) {
            let browser = Engine.newBrowser();
            browser.launchAsync(url);
            browser.waitUrl(".*?api/chapters/.*?", 10000)
            var retry = 0;
            while (retry < 5) {
                sleep(1000);
                let doc = browser.html();
                var text = doc.select("#article").text();
                if (text.length > 2000) {
                    break;
                }
                retry++;
            }

            browser.callJs("function sortChildren(t){return[].slice.call(t).sort((function(t,e){return parseInt(getComputedStyle(t).order)>parseInt(getComputedStyle(e).order)?1:-1}))}function trimContent(t){return t.substring(1,t.length-1)}let s=\"\",trash=document.getElementById(\"article\").getElementsByTagName(\"div\");for(let t=trash.length-1;t>=0;t--)trash[t].parentNode.removeChild(trash[t]);trash=document.getElementById(\"article\").getElementsByTagName(\"script\");for(let t=trash.length-1;t>=0;t--)trash[t].parentNode.removeChild(trash[t]);let parent=sortChildren(document.getElementById(\"article\").children);for(let t=0;t<parent.length;t++){let e=sortChildren(parent[t].children);for(let t=0;t<e.length;t++){let n=getComputedStyle(e[t],\":before\");n&&\"none\"!=n.content&&(s+=trimContent(n.content)),\"rtl\"==getComputedStyle(e[t]).direction?s+=e[t].textContent.split(\"\").reverse().join(\"\"):s+=e[t].textContent;let r=getComputedStyle(e[t],\":after\");r&&\"none\"!=r.content&&(s+=trimContent(r.content))}s+=\"<br>\"}document.getElementById(\"article\").innerHTML=s;", 200);
            sleep(100);
            doc = browser.html();
            browser.close();
        }
        doc.select("script").remove();
        doc.select("div.nh-read__alert").remove();
        doc.select("small.text-muted").remove();
        doc.select(".text-center").remove();
        var html = doc.select("#article").first().html().replace(/&nbsp;/g, " ");
        var trash = html.match(new RegExp(/====================.*?<a href=.*?\/truyen\/.*?$/g));
        if (trash) {
            trash = trash[trash.length - 1];
            if (trash.length < 2000) {
                html = html.replace(trash, "");
            }
        }
        return Response.success(html);
    }
    return null;
}