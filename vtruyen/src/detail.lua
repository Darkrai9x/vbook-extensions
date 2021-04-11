local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {}
    book["name"] =  doc:select("h1.h3"):text()
    book["cover"] = doc:select("div.nh-thumb img"):attr("src")
    book["host"] = "https://vtruyen.com"
    book["author"] = doc:select("div.page-content div.media-body ul li"):first():text()
    book["description"] = doc:select("div#nav-intro .content"):html()
    local detail = ""
    local el = doc:select("div.page-content div.media-body ul"):first():select("li")
    for i = 0, el:size() - 1 do
        detail = detail .. el:get(i):text() .. "<br>"
    end
    book["detail"] = detail
    book["ongoing"] = text:contains(detail, "Đang ra")
    return response:success(book)
end
return nil