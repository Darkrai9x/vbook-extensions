load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var doc = Http.get(url).html();

    var bookId = doc.select("input#bookId").attr("value");
    var html = doc.html();
    var size = html.match(/.*?loadBookIndex.*?\d+,\s*(\d+)\s*/);
    if (size) size = size[1];

    var signKey = html.match(/signKey\s*=\s*"(.*?)";/);
    if (signKey) signKey = signKey[1];

    var fuzzySign = html.match(/function fuzzySign[\s\S]*?}/);
    if (fuzzySign) fuzzySign = fuzzySign[0];

    var signFunc = "function signFunc(r){function o(r,o){return r>>>o|r<<32-o}for(var f,n,t=Math.pow,c=t(2,32),i=\"length\",a=\"\",e=[],u=8*r[i],v=[],g=[],h=g[i],l={},s=2;64>h;s++)if(!l[s]){for(f=0;313>f;f+=s)l[f]=s;v[h]=t(s,.5)*c|0,g[h++]=t(s,1/3)*c|0}for(r+=\"\";r[i]%64-56;)r+=\"\\0\";for(f=0;f<r[i];f++){if((n=r.charCodeAt(f))>>8)return;e[f>>2]|=n<<(3-f)%4*8}for(e[e[i]]=u/c|0,e[e[i]]=u,n=0;n<e[i];){var d=e.slice(n,n+=16),p=v;for(v=v.slice(0,8),f=0;64>f;f++){var w=d[f-15],A=d[f-2],C=v[0],F=v[4],M=v[7]+(o(F,6)^o(F,11)^o(F,25))+(F&v[5]^~F&v[6])+g[f]+(d[f]=16>f?d[f]:d[f-16]+(o(w,7)^o(w,18)^w>>>3)+d[f-7]+(o(A,17)^o(A,19)^A>>>10)|0);(v=[M+((o(C,2)^o(C,13)^o(C,22))+(C&v[1]^C&v[2]^v[1]&v[2]))|0].concat(v))[4]=v[4]+M|0}for(f=0;8>f;f++)v[f]=v[f]+p[f]|0}for(f=0;8>f;f++)for(n=3;n+1;n--){var S=v[f]>>8*n&255;a+=(16>S?0:\"\")+S.toString(16)}return a}";

    function genSign(signKey, currentPage, size) {
        return Script.execute(signFunc, "signFunc", Script.execute(fuzzySign, "fuzzySign", signKey + currentPage + size))
    }

    function getChapterInPage(currentPage) {
        return Http.get("https://koanchay.info/book/index").params({
            bookId: bookId,
            signKey: signKey,
            sign: genSign(signKey, currentPage, size),
            size: size,
            start: currentPage.toFixed(0)
        }).html()
    }

    var currentPage = 0;
    const data = [];
    doc = getChapterInPage(currentPage);
    while (doc) {
        var el = doc.select("li.chapter-name a");
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            var link = e.attr("href");
            if (link.length < 10) link = e.attr("data-href");
            data.push({
                name: e.text(),
                url: link,
                host: "https://koanchay.info"
            })
        }

        var lastPage = doc.select("ul.pagination a").last().attr("data-start");
        if (lastPage)
            lastPage = parseInt(lastPage);
        else
            lastPage = 0;
        doc = null;
        if (currentPage < lastPage) {
            currentPage = currentPage + parseInt(size);
            doc = getChapterInPage(parseInt(currentPage));
        }
    }

    return Response.success(data);
}