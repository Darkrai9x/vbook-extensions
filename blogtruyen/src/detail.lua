local url = ...
local doc = http:get(url):html()
if doc ~= nil then
    local book = {
        ["name"] = text:replace(doc:select("title"):text(), "\\s*\\|\\s*BlogTruyen.Com", ""),
        ["cover"] = doc:select(".thumbnail img"):first():attr("src"),
        ["host"] = "https://blogtruyen.vn",
        ["author"] = regexp:find(doc:select(".description"):last():html(), "<a .*?/tac-gia/.*?>(.*?)</a>"),
        ["description"] = doc:select(".detail > .content"):html(),
        ["detail"] = doc:select(".description"):last():html(),
        ["ongoing"] = text:contains(doc:select(".description"):last():html(), "Đang tiến hành")
    }
    return response:success(book)
end
return nil