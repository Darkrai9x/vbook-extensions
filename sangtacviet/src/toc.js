function execute(url) {
    if (url.slice(-1) !== "/")
        url = url + "/";
    let browser = Engine.newBrowser();
    browser.launchAsync(url);

    let injectJs = "function loadFuckkChapter(b){var a=new XMLHttpRequest;a.open(\"GET\",b,!0),a.onreadystatechange=function(){if(4==a.readyState&&200==a.status){var b=document.createElement(\"a\");b.className=\"fukkkkkk\",b.text=a.responseText,document.body.appendChild(b)}},a.send()};";

    function loadToc(url) {
        browser.callJs(injectJs + "loadFuckkChapter('" + url + "');", 100);
        var retry = 0;
        var json = '';
        while (retry < 5) {
            sleep(2000)
            let doc = browser.html();
            var data = doc.select("a.fukkkkkk");
            if (data.length > 0) {
                json = data.text();
                break;
            }
            retry++;
        }
        return json;
    }

    function waitTocUrl() {
        browser.waitUrl(".*?index.php.*?sajax=getchapterlist.*?", 10000);
        var urls = JSON.parse(browser.urls());
        var json = '';
        urls.forEach(requestUrl => {
            if (requestUrl.indexOf("getchapterlist") >= 0 && !json) {
                json = loadToc(requestUrl.replace("https://sangtacviet.pro", ""));
            }
        });
        return json;
    }

    var json = '';
    var retry = 0;
    while (retry < 5) {
        sleep(2000)
        let doc = browser.html();
        if (doc.select("#chaptercontainerinner").length > 0) {
            browser.callJs("document.getElementById('chaptercontainerinner').scrollIntoView();", 100);
            json = waitTocUrl();
            break;
        }
        retry++;
    }
    browser.close()
    if (json) {
        let list = [];
        let source = url.split('/')[4];
        let data = JSON.parse(json);
        let chapList = data.data;
        let list1 = ['biqugeinfo', 'biqugexs', 'uuxs', 'zwdu'];
        let list12 = ['69shuorg', 'xbiquge',];
        let start;
        if (chapList) {
            chapList = chapList.split("-//-")
            if (source === 'uukanshu') {
                start = chapList.length - 1
            } else if (list12.includes(source) === true) {
                start = 12
            } else if (source === 'biqugese') {
                start = 10
            } else if (source === 'biqugebz') {
                start = 9
            } else if (source === '69shu') {
                start = 5
            } else if (list1.includes(source) === true) {
                start = 1
            } else {
                start = 0
            }
            let end = (source === "uukanshu") ? -1 : chapList.length;
            let step = (source === "uukanshu") ? -1 : 1;
            for (; start !== end; start += step) {
                let chap = chapList[start].split("-/-");
                let name = chap[2];
                if (name) {
                    list.push({
                        name: name.replace('\n', '').trim()
                            .replace(/\s\s+/g, ' ')
                            .replace(/([\t\n]+|<br>|&nbsp;)/g, "")
                            .replace(/Thứ ([\d\,]+) chương/, "Chương $1:"),
                        url: url + "/" + chap[1],
                        host: "https://sangtacviet.pro"
                    });
                }
            }
        }
        return Response.success(list);
    }
    return null;
}