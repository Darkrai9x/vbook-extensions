load('config.js');
load('base64.js');

function m(str) {
    var decoded = Base64.decode(str);
    var bytes = [];
    for (var i = 0; i < decoded.length; i++) {
        bytes.push(decoded.charCodeAt(i) & 255);
    }
    return bytes;
}

function d(bytes) {
    var out = "";
    var i = 0;

    while (i < bytes.length) {
        var c = bytes[i++];

        if (c < 128) {
            out += String.fromCharCode(c);
        } else if (c < 224) {
            out += String.fromCharCode((c & 31) << 6 | bytes[i++] & 63);
        } else if (c < 240) {
            out += String.fromCharCode((c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63);
        } else {
            var codePoint = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
            codePoint -= 65536;
            out += String.fromCharCode(55296 + (codePoint >> 10), 56320 + (codePoint & 1023));
        }
    }

    return out;
}

function f(str, key) {
    var input = m(str);
    var output = [];
    for (var i = 0; i < input.length; i++) {
        output.push(input[i] ^ key.charCodeAt(i % key.length));
    }
    return d(output);
}

function decodeProtectedContent(container) {
    var protectedEl = container.select("#chapter-c-protected").first();
    if (!protectedEl) return null;

    var mode = protectedEl.attr("data-s") || "none";
    var key = protectedEl.attr("data-k") || "";
    var chunks = JSON.parse(protectedEl.attr("data-c") || "[]");
    if (!chunks || !chunks.length) return null;

    chunks.sort(function(a, b) {
        return parseInt(a.substring(0, 4), 10) - parseInt(b.substring(0, 4), 10);
    });

    var content = "";
    for (var i = 0; i < chunks.length; i++) {
        var part = chunks[i].substring(4);
        if (mode === "xor_shuffle") {
            content += f(part, key);
        } else if (mode === "base64_reverse") {
            content += d(m(part.split("").reverse().join("")));
        } else {
            content += d(m(part));
        }
    }

    content = content.replace(/\[note(\d+)]/gi, '<span id="anchor-note$1" class="note-icon none-print inline note-tooltip" data-tooltip-content="#note$1 .note-content" data-note-id="note$1"><i class="fas fa-sticky-note"></i></span><a id="anchor-note$1" class="inline-print none" href="#note$1">[note]</a>');
    return content;
}

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let htm = doc.select("div#chapter-content");
        let content = decodeProtectedContent(htm) || htm.html();

        htm.select("p.none").remove();
        htm.select("script").remove();
        htm.select("style").remove();
        htm.select("iframe").remove();
        htm.select('img[src*="/images/banners/"]').remove();
        htm.select('img[src*="/lightnovel/banners/"]').remove();
        htm.select("p:contains(Tham gia Hako Discord tại)").remove();
        htm.select("p:contains(Theo dõi Fanpage Hako tại)").remove();
        htm.select(".note-reg").remove();

        content = content
            .replace(/<div id="chapter-c-protected"[\s\S]*?<\/div>/g, "")
            .replace(/<p[^>]*class="[^"]*\bnone\b[^"]*"[^>]*>[\s\S]*?<\/p>/g, "")
            .replace(/<script[\s\S]*?<\/script>/g, "")
            .replace(/<style[\s\S]*?<\/style>/g, "")
            .replace(/<iframe[\s\S]*?<\/iframe>/g, "")
            .replace(/<img[^>]*src="[^"]*\/images\/banners\/[^"]*"[^>]*>/g, "")
            .replace(/<img[^>]*src="[^"]*\/lightnovel\/banners\/[^"]*"[^>]*>/g, "")
            .replace(/<p[^>]*>[^<]*Tham gia Hako Discord tại[\s\S]*?<\/p>/g, "")
            .replace(/<p[^>]*>[^<]*Theo dõi Fanpage Hako tại[\s\S]*?<\/p>/g, "")
            .replace(/<div[^>]*class="[^"]*\bnote-reg\b[^"]*"[^>]*>[\s\S]*?<\/div>/g, "")
            .replace(/<p id=\"\d+\">/g, "<p>")
            .replace(/\[note\d+]/g, "")
            .replace(/\&nbsp;/g, "");

        return Response.success(content);
    }
    return null;
}
