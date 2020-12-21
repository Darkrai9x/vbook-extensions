local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    book["name"] = doc:select("h1.page-title"):text()
    book["cover"] = doc:select("div.imagesach img"):attr("src")
    book["host"] = "http://gacsach.com"
    book["author"] = doc:select("div.field-name-field-author a"):first():text()
    book["description"] = doc:select("div.field-type-text-with-summary"):html()
    html:remove(doc, { "div.booktitle" })
    book["detail"] = doc:select(".field-sach .field"):html()
    book["ongoing"] = text:contains(doc:select(".field-name-field-status"):html(), "Đang ra")
    return response:success(book)
end
return nil