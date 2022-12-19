load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let parts = doc.select(".chapter-part");
        if (parts.size() === 0) {
            return Response.success(doc.select("div#bookContentBody").html());
        } else {
            let html = doc.html();
            var content = "";
            for (let i = 0; i < parts.size() / 2; i++) {
                let part = parts.get(i);
                let partContent = loadChapterPart(html, part.attr("data-id"), part.attr("data-type"), part.attr("data-pn"));
                if (partContent) {
                    content += partContent + "<br/>";
                }
            }
            return Response.success(content);
        }
    }
    return null;
}


function loadChapterPart(html, id, type, pn) {

    let signKey = html.match(/signKey\s*=\s*"(.*?)";/);
    if (signKey) signKey = signKey[1];

    let fuzzySign = html.match(/function fuzzySign[\s\S]*?}/);
    if (fuzzySign) fuzzySign = fuzzySign[0];

    let result = Script.execute(fuzzySign, "fuzzySign", signKey + type + pn + false);
    let signFunc = "function signFunc(r){function o(r,o){return r>>>o|r<<32-o}for(var f,n,t=Math.pow,c=t(2,32),i=\"length\",a=\"\",e=[],u=8*r[i],v=[],g=[],h=g[i],l={},s=2;64>h;s++)if(!l[s]){for(f=0;313>f;f+=s)l[f]=s;v[h]=t(s,.5)*c|0,g[h++]=t(s,1/3)*c|0}for(r+=\"\";r[i]%64-56;)r+=\"\\0\";for(f=0;f<r[i];f++){if((n=r.charCodeAt(f))>>8)return;e[f>>2]|=n<<(3-f)%4*8}for(e[e[i]]=u/c|0,e[e[i]]=u,n=0;n<e[i];){var d=e.slice(n,n+=16),p=v;for(v=v.slice(0,8),f=0;64>f;f++){var w=d[f-15],A=d[f-2],C=v[0],F=v[4],M=v[7]+(o(F,6)^o(F,11)^o(F,25))+(F&v[5]^~F&v[6])+g[f]+(d[f]=16>f?d[f]:d[f-16]+(o(w,7)^o(w,18)^w>>>3)+d[f-7]+(o(A,17)^o(A,19)^A>>>10)|0);(v=[M+((o(C,2)^o(C,13)^o(C,22))+(C&v[1]^C&v[2]^v[1]&v[2]))|0].concat(v))[4]=v[4]+M|0}for(f=0;8>f;f++)v[f]=v[f]+p[f]|0}for(f=0;8>f;f++)for(n=3;n+1;n--){var S=v[f]>>8*n&255;a+=(16>S?0:\"\")+S.toString(16)}return a}";
    let sign = Script.execute(signFunc, "signFunc", result);
    let response = fetch(BASE_URL +"/chapters/part", {
        method: "POST",
        body: {
            id: id,
            type: type,
            pn: pn,
            en: false,
            signKey: signKey,
            sign: sign
        }
    });

    if (response.ok) {
        return response.json().data.content;
    }
    return null;
}