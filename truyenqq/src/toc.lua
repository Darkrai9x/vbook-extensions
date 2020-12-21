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
    local list = {}
    local el = doc:select(".works-chapter-list a")
    for i = el:size() - 1, 0, -1 do
        local e = el:get(i)
        local chap = {
            ["name"] = e:text(),
            ["url"] = e:attr("href"),
            ["host"] = "https://truyenqq.com",
        }
        table.insert(list, chap)
    end
    return response:success(list)
end
return nil