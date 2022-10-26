function execute(url) {
    var content = '';
    if (url.indexOf("----/----") === -1) {
        if (url.slice(-1) !== "/")
            url = url + "/";
        let browser = Engine.newBrowser();
        browser.launchAsync(url);
        browser.waitUrl(".*?index.php.*?sajax=readchapter.*?", 10000);

        var retry = 0;
        while (retry < 5) {
            sleep(1000);
            let doc = browser.html();
            var text = doc.select("#content-container > .contentbox").text();
            if (text.indexOf('Đang tải nội dung chương') === -1) {
                doc.select("i[hd]").remove();
                content = doc.select("#content-container > .contentbox").html();
                break;
            }
            retry++;
        }

        browser.close();
    } else {
        let urlPart = url.split("----/----");
        let chapIndex = parseInt(urlPart[1]);
        let browser = Engine.newBrowser();
        browser.launchAsync(urlPart[0]);

        var retry = 0;
        while (retry < 5) {
            sleep(1000)
            let doc = browser.html();
            if (doc.select("#chaptercontainerinner").length > 0) {
                browser.callJs("document.getElementById('chaptercontainerinner').scrollIntoView();", 100);
                break;
            }
            retry++;
        }

        retry = 0;
        while (retry < 5) {
            sleep(1000)
            let doc = browser.html();
            if (doc.select("a.listchapitem").length > 0) {
                browser.callJs("document.getElementsByClassName('listchapitem')[" + chapIndex + "].click()", 100);
                break;
            }
            retry++;
        }

        retry = 0;
        while (retry < 5) {
            sleep(1000);
            let doc = browser.html();
            var text = doc.select("#content-container > .contentbox").text();
            if (text.indexOf('Đang tải nội dung chương') === -1) {
                doc.select("i[hd]").remove();
                content = doc.select("#content-container > .contentbox").html();
                break;
            }
            retry++;
        }
        browser.close()
    }

    let charMap = {
        'Ҋ': 'U',
        'ҋ': 'p',
        'Ҍ': 'N',
        'ҍ': 'e',
        'Ҏ': 'd',
        'ҏ': 'u',
        'Ґ': 'P',
        'ґ': 'z',
        'Ғ': 'j',
        'ғ': 'C',
        'Ҕ': 'H',
        'ҕ': 'g',
        'Җ': 'D',
        'җ': 'y',
        'Ҙ': 'n',
        'ҙ': 'm',
        'Қ': 'M',
        'қ': 'c',
        'Ҝ': 'O',
        'ҝ': 'W',
        'Ҟ': 'T',
        'ҟ': 'w',
        'Ҡ': 'B',
        'ҡ': 'A',
        'Ң': 'G',
        'ң': 'Z',
        'Ҥ': 'Q',
        'ҥ': 'v',
        'Ҧ': 'q',
        'ҧ': 'V',
        'Ҩ': 'o',
        'ҩ': 'f',
        'Ҫ': 'F',
        'ҫ': 'Y',
        'Ҭ': 'J',
        'ҭ': 'l',
        'Ү': 'k',
        'ү': 'X',
        'Ұ': 's',
        'ұ': 'L',
        'Ҳ': 'x',
        'ҳ': 'h',
        'Ҵ': 'E',
        'ҵ': 'K',
        'Ҷ': 'a',
        'ҷ': 'R',
        'Ҹ': 'S',
        'ҹ': 'b'
    };
    var newContent = '';
    for (let i = 0; i < content.length; i++) {
        let newChar = charMap[content[i]];
        if (newChar) {
            newContent += newChar;
        } else {
            newContent += content[i];
        }
    }
    newContent = newContent.replace(/<p>/g, "")
        .replace(/&lt;p&gt;/g, "")
        .replace(/<i.*?>(.*?)<\/i>/g, '$1')
        .replace(/<span.*?>(.*?)<\/span>(<br>)?/g, "")
        .replace(/<a href=.*?<\/a>/g, "")
        .replace(/ +/g, " ")
        .replace(/<br>/g, "\n")
        .replace(/\n+/g, "<br>")
        .replace(/\u201c/g, "")
        .replace(/\u201d/g, "")
        .replace(/&(nbsp|amp|quot|lt|gt|bp|emsp);/g, "");
    return Response.success(newContent);
}