local key, page = ...

if text:is_empty(page) then
    page = 1
end
url = "http://truyenqq.com/tim-kiem/trang-" .. page .. ".html?q=" .. key

function bypass(doc)
    local cookie = regexp:find(doc:html(), "document.cookie=\"(.*?)\"")
    if not text:is_empty(cookie) then
        doc = http:get(url):header("Cookie", cookie):html()
    end

    return doc
end

if text:is_empty(page) then
    page = 1
end
local doc = bypass(http:get(url):html())

if doc ~= nil then
    local el = doc:select("ul.list-stories .story-item")
    local novelList = {}
    local next

    local last = doc:select(".pagination-list"):select("li:has(a.is-current) + li"):last():select("a")
    if last ~= nil then
        next = last:text()
    end
    for i = 0, el:size() - 1 do
        local e = el:get(i)
        local novel = {
            ["name"] = e:select(".title-book"):text(),
            ["link"] = e:select(".title-book a"):first():attr("href"),
            ["description"] = e:select(".episode-book"):text(),
            ["cover"] = e:select("img.story-cover"):attr("src"),
            ["host"] = "https://truyenqq.com"
        }
        table.insert(novelList, novel)
    end

    return response:success(novelList, next)
end

return nil
