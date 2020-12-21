local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    local cover = doc:select(".series-cover .img-in-ratio"):first():attr("style")
    cover = regexp:find(cover, "url.'(.*?)'")
    book["name"] =  doc:select(".series-name"):text()
    book["cover"] = cover
    book["host"] = "https://ln.hako.re"
    book["author"] = doc:select(".series-information .info-item a"):first():text()
    book["description"] = doc:select(".summary-content"):html()
    book["detail"] = doc:select(".series-information .info-item")
    book["ongoing"] = text:contains(doc:select(".series-information .info-item"):html(), "truyen-dang-tien-hanh")
    return response:success(book)
end
return nil