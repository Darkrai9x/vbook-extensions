load('config.js');

function execute(url) {
    let slug = url.substring(url.lastIndexOf("/") + 1);
    let response = fetch(BASE_URL.replace("https://", "https://api.") + "/api/book/get-chapter-list-version-2/" + slug + "/13");

    if (response.ok) {
        let json = response.json();

        let data = JSON.parse(r.de(json.data));
        let chapters = [];
        data.forEach(chapter => {
            chapters.push({
                name: chapter.name,
                url: slug + "/" + chapter.slug,
                host: BASE_URL
            });
        })
        return Response.success(chapters);
    }

    return null;
}

var r = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    en: function (t) {
        var e, n, a, o, u, c, i, s = "", f = 0;
        for (t = r._utf8_encode(t); f < t.length;)
            o = (e = t.charCodeAt(f++)) >> 2,
                u = (3 & e) << 4 | (n = t.charCodeAt(f++)) >> 4,
                c = (15 & n) << 2 | (a = t.charCodeAt(f++)) >> 6,
                i = 63 & a,
                isNaN(n) ? c = i = 64 : isNaN(a) && (i = 64),
                s = s + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(c) + this._keyStr.charAt(i);
        return s
    },
    de: function (t) {
        var e, n, a, o, u, c, i = "", s = 0;
        for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); s < t.length;)
            e = this._keyStr.indexOf(t.charAt(s++)) << 2 | (o = this._keyStr.indexOf(t.charAt(s++))) >> 4,
                n = (15 & o) << 4 | (u = this._keyStr.indexOf(t.charAt(s++))) >> 2,
                a = (3 & u) << 6 | (c = this._keyStr.indexOf(t.charAt(s++))),
                i += String.fromCharCode(e),
            64 != u && (i += String.fromCharCode(n)),
            64 != c && (i += String.fromCharCode(a));
        return i = r._utf8_decode(i)
    },
    _utf8_encode: function (t) {
        t = t.replace(/\r\n/g, "\n");
        for (var e = "", n = 0; n < t.length; n++) {
            var r = t.charCodeAt(n);
            r < 128 ? e += String.fromCharCode(r) : r > 127 && r < 2048 ? (e += String.fromCharCode(r >> 6 | 192),
                e += String.fromCharCode(63 & r | 128)) : (e += String.fromCharCode(r >> 12 | 224),
                e += String.fromCharCode(r >> 6 & 63 | 128),
                e += String.fromCharCode(63 & r | 128))
        }
        return e
    },
    _utf8_decode: function (t) {
        for (var e = "", n = 0, r = 0, a = 0, o = 0; n < t.length;)
            (r = t.charCodeAt(n)) < 128 ? (e += String.fromCharCode(r),
                n++) : r > 191 && r < 224 ? (o = t.charCodeAt(n + 1),
                e += String.fromCharCode((31 & r) << 6 | 63 & o),
                n += 2) : (o = t.charCodeAt(n + 1),
                a = t.charCodeAt(n + 2),
                e += String.fromCharCode((15 & r) << 12 | (63 & o) << 6 | 63 & a),
                n += 3);
        return e
    }
}