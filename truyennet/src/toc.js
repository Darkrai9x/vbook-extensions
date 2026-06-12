var BASE_URL = "https://truyennet.org";
var USER_AGENT = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) vBook TruyenNet/1.0";

function normalizeUrl(url) {
  if (!url) return BASE_URL;
  return String(url).replace(/^(?:https?:\/\/)?(?:www\.)?truyennet\.org/i, BASE_URL);
}

function absUrl(url) {
  if (!url) return "";
  url = String(url);
  if (url.indexOf("//") === 0) return "https:" + url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) !== "/") url = "/" + url;
  return BASE_URL + url;
}

function cleanText(value) {
  if (!value) return "";
  return String(value)
    .replace(/\u00a0/g, " ")
    .replace(/[\t\f\v]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function firstText(doc, selectors) {
  for (var i = 0; i < selectors.length; i++) {
    var text = cleanText(doc.select(selectors[i]).first().text());
    if (text) return text;
  }
  return "";
}

function firstAttr(doc, selectors, attr) {
  for (var i = 0; i < selectors.length; i++) {
    var value = cleanText(doc.select(selectors[i]).first().attr(attr));
    if (value) return value;
  }
  return "";
}

function parseSlug(url) {
  url = normalizeUrl(url).split("#")[0].split("?")[0].replace(/\/+$/, "");
  var match = url.match(/truyennet\.org\/([^\/]+)/i);
  return match ? match[1] : "";
}

function parseBookIdFromDoc(doc) {
  var bid = cleanText(doc.select("input[name=bid]").attr("value"));
  if (bid) return bid;
  var html = doc.html();
  var match = html.match(/page\(\s*(\d+)\s*,\s*\d+\s*\)/i) || html.match(/var\s+rid\s*=\s*['\"](\d+)['\"]/i);
  return match ? match[1] : "";
}

function parseListPageCountFromDoc(doc) {
  var html = doc.html();
  var matches = html.match(/page\(\s*\d+\s*,\s*\d+\s*\)/ig) || [];
  var max = 1;
  for (var i = 0; i < matches.length; i++) {
    var pageMatch = matches[i].match(/page\(\s*\d+\s*,\s*(\d+)\s*\)/i);
    if (pageMatch) {
      var value = parseInt(pageMatch[1]);
      if (value > max) max = value;
    }
  }
  return max;
}

function parseChapterNumber(title, href) {
  var match = String(title || "").match(/^Chương\s+(\d+)/i) || String(href || "").match(/\/chuong-(\d+)(?:\D|$)/i);
  return match ? parseInt(match[1]) : 0;
}

function parseNovelItems(doc) {
  var list = [];
  doc.select(".truyen-list .item").forEach(function (item) {
    var linkEl = item.select("h3 a, a.cover").first();
    var link = linkEl.attr("href");
    if (!link) return;
    var name = cleanText(item.select("h3 a").first().text()) || cleanText(linkEl.attr("title"));
    if (!name) return;
    var cover = absUrl(item.select("a.cover img, img").first().attr("src"));
    var lines = [];
    item.select("p.line").forEach(function (line) {
      var text = cleanText(line.text());
      if (text) lines.push(text);
    });
    list.push({
      name: name,
      link: absUrl(link),
      cover: cover,
      description: lines.join("\n"),
      host: BASE_URL
    });
  });
  return list;
}

function findNextPage(doc) {
  var next = "";
  doc.select(".phan-trang a, .pagination a").forEach(function (a) {
    var text = cleanText(a.text()).toLowerCase();
    var rel = cleanText(a.attr("rel")).toLowerCase();
    if (!next && (text === "next" || text === ">" || text.indexOf("sau") >= 0 || rel === "next")) {
      next = absUrl(a.attr("href"));
    }
  });
  if (next) return next;
  var activeText = cleanText(doc.select(".phan-trang .active, .pagination .active").last().text());
  var activeNumber = parseInt(activeText || "0");
  doc.select(".phan-trang a, .pagination a").forEach(function (a) {
    var number = parseInt(cleanText(a.text()) || "0");
    if (!next && activeNumber && number === activeNumber + 1) next = absUrl(a.attr("href"));
  });
  return next || null;
}

function execute(url) {
  var slug = "";
  var hashIndex = String(url).indexOf("#slug=");
  if (hashIndex >= 0) {
    slug = decodeURIComponent(String(url).substring(hashIndex + 6));
    url = String(url).substring(0, hashIndex);
  }
  var referer = slug ? BASE_URL + "/" + slug : BASE_URL;
  var response = fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Referer": referer,
      "X-Requested-With": "XMLHttpRequest",
      "Accept": "application/json,text/html,*/*"
    }
  });
  if (!response.ok) return Response.error("Không tải được mục lục: " + url);

  var json = response.json();
  var html = json && json.data ? json.data : "";
  var doc = Html.parse(html);
  var list = [];
  doc.select("a[href]").forEach(function (a) {
    var href = a.attr("href");
    var title = cleanText(a.text());
    if (!href || !title || !/^Chương\s+\d+/i.test(title)) return;
    if (slug && href.indexOf("/" + slug + "/chuong-") < 0) return;
    var number = parseChapterNumber(title, href);
    list.push({ name: title, url: absUrl(href), host: BASE_URL, _number: number });
  });
  list.sort(function (a, b) { return (a._number || 0) - (b._number || 0); });
  for (var i = 0; i < list.length; i++) delete list[i]._number;
  return Response.success(list);
}