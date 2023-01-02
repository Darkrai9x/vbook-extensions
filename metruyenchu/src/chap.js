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

            browser.callJs("function sortChildren(e){return[].slice.call(e).sort(function(e,t){return parseInt(getComputedStyle(e).order)>parseInt(getComputedStyle(t).order)?1:-1})}function trimContent(e){return e.substring(1,e.length-1)}let s=\"\",trash=document.getElementById(\"article\").getElementsByTagName(\"div\");for(let index=trash.length-1;index>=0;index--)trash[index].parentNode.removeChild(trash[index]);trash=document.getElementById(\"article\").getElementsByTagName(\"script\");for(let index=trash.length-1;index>=0;index--)trash[index].parentNode.removeChild(trash[index]);let parent=sortChildren(document.getElementById(\"article\").children);for(let i=0;i<parent.length;i++){let e=sortChildren(parent[i].children);for(let t=0;t<e.length;t++){let n=getComputedStyle(e[t],\":before\");n&&\"none\"!=n.content&&(s+=trimContent(n.content));\"rtl\"==getComputedStyle(e[t]).direction?s+=e[t].textContent.split(\"\").reverse().join(\"\"):s+=e[t].textContent;let r=getComputedStyle(e[t],\":after\");r&&\"none\"!=r.content&&(s+=trimContent(r.content))}s+=\"<br>\"}let newBody=document.createElement(\"fakearticle\");newBody.innerHTML=s,document.body.appendChild(newBody);", 200);
            sleep(100);
            content = browser.html().select("fakearticle");
            browser.close();
        }

        content.select("script").remove();
        content.select("div.nh-read__alert").remove();
        content.select("small.text-muted").remove();
        content.select(".text-center").remove();
        var html = content.html().replace(/&nbsp;/g, " ");
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