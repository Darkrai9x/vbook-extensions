function execute(url) {
    url = url.replace("wikidich.com", "wikidth.com");
    var doc = Http.get(url).html();

    var bookId = doc.select("input#bookId").attr("value");
    var html = doc.html();
    var size = html.match(/.*?loadBookIndex.*?\d+,\s*(\d+)\s*/);
    if (size) size = size[1];

    var signKey = html.match(/signKey\s*=\s*"(.*?)";/);
  
    if (signKey) signKey = signKey[1];

    var fuzzySign = html.match(/function fuzzySign[\s\S]*?}/);

    if (fuzzySign) fuzzySign = fuzzySign[0];
    var signFunc = function a(W) {
        function V(d, c) {
            return d >>> c | d << 32 - c
        }
        for (var U, T, S = Math.pow, R = S(2, 32), Q = "length", P = "", O = [], N = 8 * W[Q], M = a.h = a.h || [], L = a.k = a.k || [], K = L[Q], J = {}, I = 2; 64 > K; I++) {
            if (!J[I]) {
                for (U = 0; 313 > U; U += I) {
                    J[U] = I
                }
                M[K] = S(I, 0.5) * R | 0,
                    L[K++] = S(I, 1 / 3) * R | 0
            }
        }
        for (W += "\x80"; W[Q] % 64 - 56; ) {
            W += "\x00"
        }
        for (U = 0; U < W[Q]; U++) {
            if (T = W.charCodeAt(U),
            T >> 8) {
                return
            }
            O[U >> 2] |= T << (3 - U) % 4 * 8
        }
        for (O[O[Q]] = N / R | 0,
                 O[O[Q]] = N,
                 T = 0; T < O[Q]; ) {
            var H = O.slice(T, T += 16)
                , G = M;
            for (M = M.slice(0, 8),
                     U = 0; 64 > U; U++) {
                var F = H[U - 15]
                    , E = H[U - 2]
                    , D = M[0]
                    , C = M[4]
                    , B = M[7] + (V(C, 6) ^ V(C, 11) ^ V(C, 25)) + (C & M[5] ^ ~C & M[6]) + L[U] + (H[U] = 16 > U ? H[U] : H[U - 16] + (V(F, 7) ^ V(F, 18) ^ F >>> 3) + H[U - 7] + (V(E, 17) ^ V(E, 19) ^ E >>> 10) | 0)
                    , A = (V(D, 2) ^ V(D, 13) ^ V(D, 22)) + (D & M[1] ^ D & M[2] ^ M[1] & M[2]);
                M = [B + A | 0].concat(M),
                    M[4] = M[4] + B | 0
            }
            for (U = 0; 8 > U; U++) {
                M[U] = M[U] + G[U] | 0
            }
        }
        for (U = 0; 8 > U; U++) {
            for (T = 3; T + 1; T--) {
                var z = M[U] >> 8 * T & 255;
                P += (16 > z ? 0 : "") + z.toString(16)
            }
        }
        return P
    };

    function genSign(signKey, currentPage, size) {
        return signFunc(Script.execute(fuzzySign, "fuzzySign", signKey + currentPage + size));
    }

    function getChapterInPage(currentPage) {
        return Http.get("https://wikidth.com/book/index").queries({
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
                host: "https://wikidth.com"
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