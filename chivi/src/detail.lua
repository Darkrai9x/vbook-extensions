local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {
        ["name"] = doc:select(".title > h1"):text(),
        ["cover"] = doc:select(".cover img"):first():attr("src"),
        ["host"] = "https://chivi.xyz",
        ["author"] = doc:select("[property=og:novel:author]"):attr("content"),
        ["description"] = doc:select(".summary p"):html(),
        ["detail"] = doc:select(".extra"):first():html(),
        ["ongoing"] = text:contains(doc:select(".extra"):first():html(), "Còn tiếp")
    }
    return response:success(book)
end
return nil