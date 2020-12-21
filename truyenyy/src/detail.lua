local url = ...
local doc = http:get(text:replace(url, "truyenyy.com", "truyenyy.vn")):html()
if doc ~= nil then
    local book = {}
    book["name"] = doc:select("div.info h1"):text()
    local cover = doc:select("div.novel-info img"):attr("src")
    if (cover == nil or string.len(cover) == 0) then
        cover = doc:select("div.novel-info img"):attr("data-src")
    end
    book["cover"] = cover
    book["host"] = "http:"
    book["author"] = doc:select("div.info .author"):text()
    book["description"] = doc:select("section#id_novel_summary"):html()
    book["detail"] = doc:select("div.info .author"):html()
    book["ongoing"] = text:contains(doc:select("div.info"):html(), "status=C")
    return response:success(book)
end
return nil