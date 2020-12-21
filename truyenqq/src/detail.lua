local url = ...

function bypass(doc)
    local cookie = regexp:find(doc:html(), "document.cookie=\"(.*?)\"")
    if not text:is_empty(cookie) then
        doc = http:get(url):header("Cookie", cookie):html()
    end

    return doc
end

local doc = bypass(http:get(url):html())
if doc ~= nil then
    local book = {
        ["name"] = doc:select("h1[itemprop=name]"):text(),
        ["cover"] = doc:select(".block01 img"):first():attr("src"),
        ["host"] = "http://truyenqq.com",
        ["author"] = doc:select("a.org"):text(),
        ["description"] = doc:select("div.story-detail-info"):html(),
        ["detail"] = doc:select(".block01 div.txt"):first():html(),
        ["ongoing"] = text:contains(doc:select("div.block01"):html(), "Đang Cập Nhật")
    }
    return response:success(book)
end
return nil