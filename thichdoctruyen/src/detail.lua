local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    book["name"] =  doc:select("h1.h1truyen"):text()
    book["cover"] = doc:select("div.book img[itemprop=image]"):attr("src")
    book["host"] = "https://thichdoctruyen.com"
    book["author"] = doc:select("a[itemprop=author]"):text()
    book["description"] = doc:select("div#viewtomtat2"):html()
    book["detail"] = doc:select("div#thongtintruyen1 .truyenp1"):html()
    book["ongoing"] = text:contains(doc:select(".truyenp1"):html(), "Tình trạng: Còn Tiếp...")
    return response:success(book)
end
return nil