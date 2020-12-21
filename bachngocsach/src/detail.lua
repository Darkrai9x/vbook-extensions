local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    book["name"] =  doc:select("h1#truyen-title"):text()
    book["cover"] = doc:select("div#anhbia img"):attr("src")
    book["host"] = "http://bachngocsach.com"
    book["author"] = doc:select("div#tacgia a"):text()
    book["description"] = doc:select("div#gioithieu"):html()
    book["detail"] = doc:select("div#tacgia"):html() .. "<br>" .. doc:select("div#theloai"):html()
    return response:success(book)
end
return nil