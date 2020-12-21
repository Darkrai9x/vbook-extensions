local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {
        ["name"] = doc:select("h1.title"):text(),
        ["cover"] = doc:select(".cover img"):first():attr("src"),
        ["host"] = "https://chivi.xyz",
        ["author"] = doc:select(".author"):text(),
        ["description"] = doc:select(".summary p"):html(),
        ["detail"] = doc:select(".extra"):first():html(),
        ["ongoing"] = text:contains(doc:select(".extra"):first():html(), "Còn tiếp")
    }
    return response:success(book)
end
return nil