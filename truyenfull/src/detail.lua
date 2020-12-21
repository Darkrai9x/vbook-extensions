local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    book["name"] =  doc:select("h3.title"):text()
    book["cover"] = doc:select("div.book img"):attr("src")
    book["host"] = "http://truyenfull.vn"
    book["author"] = doc:select("div.info div a"):first():text()
    book["description"] = doc:select("div.desc-text"):html()
    book["detail"] = text:remove(doc:select("div.info"):html(), "</?h3>")
    book["ongoing"] = text:contains(doc:select("div.info"):html(), ">Đang ra<")
    return response:success(book)
end
return nil