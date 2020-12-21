local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local info = doc:select(".detail_infos")

    local book = {
        ["name"] = info:select(".title"):text(),
        ["cover"] = doc:select(".detail_info img"):first():attr("src"),
        ["host"] = "https://www.medoctruyenchu.net",
        ["author"] = info:select(".other_infos font"):first():text(),
        ["description"] = info:select(".summary"):last():html(),
        ["detail"] = info:select(".other_infos"):first():html(),
        ["ongoing"] = not text:contains(info:html(), "Đã kết thúc"),
        ["url"] = text:replace(url, "m.medoctruyenchu.net", "www.medoctruyenchu.net")
    }
    return response:success(book)
end
return nil